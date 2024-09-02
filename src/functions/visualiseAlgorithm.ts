import { MutableRefObject } from "react";
import Point from "../types/Point";
import { clearCanvas, plotPath, plotPoints } from "./draw/draw";
import { generateEdges, pathCost } from "./helpers";
import drawAnimatedPath from "./draw/drawAnimatedPath";
import {
  drawAllPossibleEdges,
  drawCloseEdges,
  getHeadEdges,
} from "./draw/helpers";
import drawMultipleAnimatedPaths from "./draw/drawMultipleAnimatedPaths";
import { Stat } from "../config/Stats";
import Record from "../types/Record";
import Ant from "../utils/ant";
import AntColonyOptions from "../types/AntColonyOptions";

export type VisualiseAlgorithmProps = {
  points: Point[];
  canvas: MutableRefObject<HTMLCanvasElement | null>;
  ctx: CanvasRenderingContext2D | null;
  frames: Frame[];
  speed?: number;
  running: MutableRefObject<Boolean>;
  algorithmFinished: () => void;
  calculateDistances?: boolean;
  result?: any;
  visualiseCloseEdges?: boolean;
  visualiseAllPossibleEdges?: boolean;
  visualiseHeadEdges?: boolean;
  animatePath?: boolean;
  defaultSpeed?: number;
  colour?: string;
  completionColour?: string;
  showExtraLines?: boolean;
  animate?: boolean;
  numberOfPoints: number;
  setStats: (stats: Stat[]) => void;
  stats: Stat[];
  setHistory: (history: Record[]) => void;
  history: Record[];
  currentAlgorithm: number;
  antColonyOptions?: AntColonyOptions;
  hideMarkers?: boolean;
};

export type Path = {
  path: Point[];
  distance: number | null;
  pathIndexes?: number[];
};

export type Frame = {
  paths: Path[];
  distance: number | null;
};

const VisualiseAlgorithm = async ({
  points,
  canvas,
  ctx,
  frames,
  speed = 10,
  defaultSpeed = 10,
  running,
  algorithmFinished,
  calculateDistances = false,
  result,
  visualiseCloseEdges = false,
  visualiseAllPossibleEdges = false,
  animatePath = false,
  colour = "white",
  completionColour = "white",
  showExtraLines = false,
  animate = false,
  numberOfPoints,
  visualiseHeadEdges = false,
  setStats,
  stats,
  setHistory,
  history,
  currentAlgorithm,
  antColonyOptions,
  hideMarkers = false,
}: VisualiseAlgorithmProps) => {
  const antImage = new Image();
  antImage.src = "./ant.svg";

  const antSVG = Ant(colour);

  if (result) {
    frames = result;
  }

  if (animatePath) {
    speed = numberOfPoints * 1200 + 1000;
  } else {
    speed = defaultSpeed * speed;
  }

  if (calculateDistances) {
    frames = await Promise.all(
      frames.map(async (frame: Frame) => {
        const distance = Math.floor(
          (
            await Promise.all(
              frame.paths.map(async (curr) => (await pathCost(curr.path)) ?? 0)
            )
          ).reduce((acc, curr) => acc + curr, 0)
        );
        return { ...frame, distance };
      })
    );
  }

  var timeouts: any = [];

  const allEdges = generateEdges(points);

  const edgeMax = allEdges.reduce((max, edge) => {
    return Math.max(max, edge.distance);
  }, 0);

  frames.forEach(({ distance, paths }, index: number) => {
    timeouts.push(
      setTimeout(async () => {
        const lastFrame = index == frames.length - 1;

        if (running.current) {
          const bestPath = paths.reduce((best, current) => {
            return current.path.length < best.path.length ? current : best;
          }, paths[0]);

          setStats(
            stats.map((stat: Stat) => {
              const statValues: { [key: string]: number } = {
                totalDistance: Math.round(distance ?? 0),
                currentPermutation: index,
                completedEdges: index,
                completedPoints: index,
                solvedPoints: index + 1,
                iteration: index + 1,
                bestPath: Math.round(bestPath.distance ?? 0),
              };

              return stat.id in statValues
                ? { ...stat, value: statValues[stat.id] }
                : stat;
            })
          );

          clearCanvas(canvas.current!, ctx!);

          if (showExtraLines) {
            if (visualiseCloseEdges) {
              drawCloseEdges(paths, allEdges, ctx!, edgeMax, hideMarkers);
            }

            if (visualiseAllPossibleEdges) {
              drawAllPossibleEdges(paths, allEdges, ctx!, edgeMax, hideMarkers);
            }
          }

          if (animate) {
            if (animatePath) {
              const numberPoints = paths[0].path.length;

              const opacity = 1 / paths.length;

              const [r, g, b] = colour.match(/\d+/g)!.map(Number);
              const newColour = `rgba(${r},${g},${b},${opacity})`;

              const showHeadEdges = visualiseHeadEdges && showExtraLines;

              for (let i = 0; i < numberPoints - 1; i++) {
                const extraDraw: {
                  path: Point[];
                  distance: number;
                  colour: string;
                }[] = [];

                if (showHeadEdges) {
                  paths.map(({ path }) => {
                    const previousPoints = path.slice(0, i + 1);
                    allEdges.forEach((edge) => {
                      if (edge.point1 === path[i + 1]) {
                        if (!previousPoints.includes(edge.point2)) {
                          const opacity = Math.pow(
                            1 - edge.distance / edgeMax,
                            8
                          );
                          extraDraw.push({
                            path: [edge.point1, edge.point2],
                            distance: edge.distance,
                            colour: `rgba(255,255,255,${opacity})`,
                          });
                        }
                      } else if (edge.point2 === path[i + 1]) {
                        if (!previousPoints.includes(edge.point1)) {
                          const opacity = Math.pow(
                            1 - edge.distance / edgeMax,
                            8
                          );
                          extraDraw.push({
                            path: [edge.point2, edge.point1],
                            distance: edge.distance,
                            colour: `rgba(255,255,255,${opacity})`,
                          });
                        }
                      }
                    });
                  });
                }

                setTimeout(() => {
                  setStats(
                    stats.map((stat) => {
                      if (stat.id === "pointsExplored") {
                        return { ...stat, value: i + 1 };
                      } else if (stat.id === "iteration") {
                        return { ...stat, value: index + 1 };
                      }
                      return stat;
                    })
                  );

                  drawMultipleAnimatedPaths({
                    paths: paths.map(({ path }) => [path[i], path[i + 1]]),
                    ctx: ctx!,
                    extraDraw,
                    speed: 1000,
                    lastFrame: i == numberPoints - 2,
                    canvas: canvas.current!,
                    colour: newColour,
                    completionColour,
                    plotPreviousPath: false,
                    points,
                    previousPaths: paths.map(({ path }) =>
                      path.slice(0, i + 2)
                    ),
                    bestPath,
                    antImage: antSVG,
                    hideMarker: hideMarkers,
                  });
                }, i * (showHeadEdges ? 1000 : 500));
              }
            } else {
              const extraDraw = showExtraLines
                ? getHeadEdges(paths, allEdges, edgeMax)
                : [];

              drawAnimatedPath({
                path: paths[0].path,
                ctx: ctx!,
                extraDraw,
                speed: speed * 2,
                lastFrame,
                canvas: canvas.current!,
                colour,
                completionColour,
                hideMarker: hideMarkers,
              });
            }
          } else {
            paths?.forEach(({ path }) => {
              plotPath(
                path,
                ctx!,
                lastFrame ? completionColour : colour,
                hideMarkers
              );
            });
          }

          plotPoints(points, ctx!, hideMarkers);

          timeouts.shift();
        } else {
          timeouts.forEach((timeout: any) => {
            clearTimeout(timeout);
          });
          algorithmFinished();
        }

        if (lastFrame) {
          setTimeout(
            () => {
              const record: Record = {
                id: (history.length + 1).toString(),
                algorithmIndex: currentAlgorithm,
                points: points,
                distance: Math.round(distance ?? 0),
                frames: frames,
              };

              const isDuplicate = history.some(
                (r) =>
                  r.algorithmIndex === record.algorithmIndex &&
                  JSON.stringify(r.points) === JSON.stringify(record.points) &&
                  r.distance === record.distance
              );

              if (!isDuplicate) {
                setHistory([...history, record]);
              }

              setStats(
                stats.map((stat) => {
                  if (stat.id === "bestPath" || stat.id === "totalDistance") {
                    return {
                      ...stat,
                      value: Math.round(distance ?? 0),
                    };
                  } else if (
                    [
                      "completedEdges",
                      "completedPoints",
                      "solvedPoints",
                      "pointsExplored",
                    ].includes(stat.id)
                  ) {
                    return {
                      ...stat,
                      value: numberOfPoints,
                    };
                  }
                  return stat;
                })
              );

              algorithmFinished();
            },
            animatePath ? numberOfPoints * 500 : 0
          );
        }
      }, index * speed)
    );
  });
};

export default VisualiseAlgorithm;
