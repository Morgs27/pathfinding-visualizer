import { MutableRefObject } from "react";
import Point from "../types/Point";
import { clearCanvas, plotPath, plotPoints } from "./basicDrawFunctions";
import { generateEdges, pathCost } from "./helpers";
import drawAnimatedPath from "./drawAnimatedPath";
import getHeadEdges from "./getHeadEdges";
import drawAllPossibleEdges from "./drawAllPossibleEdges";
import drawCloseEdges from "./drawCloseEdges";
import drawAnimatedPathV2 from "./drawAnimatedPathV2";
import { Stat } from "../config/Stats";

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
}: VisualiseAlgorithmProps) => {
  const antImage = new Image();
  antImage.src = "./ant.svg";

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
                iterations: index,
                bestPath: Math.round(bestPath.distance ?? 0),
              };

              return stat.id in statValues
                ? { ...stat, value: statValues[stat.id] }
                : stat;
            })
          );

          /// Draw Frame ///
          clearCanvas(canvas.current!, ctx!);

          if (showExtraLines) {
            if (visualiseCloseEdges) {
              drawCloseEdges(paths, allEdges, ctx!, edgeMax);
            }

            if (visualiseAllPossibleEdges) {
              drawAllPossibleEdges(paths, allEdges, ctx!, edgeMax);
            }
          }

          if (animate) {
            if (animatePath) {
              const numberPoints = paths[0].path.length;

              const opacity = 1 / paths.length;

              for (let i = 0; i < numberPoints - 1; i++) {
                const extraDraw: {
                  path: Point[];
                  distance: number;
                  colour: string;
                }[] = [];

                if (visualiseHeadEdges) {
                  paths.map(({ path }) => {
                    const previousPoints = path.slice(0, i + 1);
                    allEdges.forEach((edge) => {
                      if (edge.point1 === path[i + 1]) {
                        if (!previousPoints.includes(edge.point2)) {
                          const opacity = Math.pow(
                            1 - edge.distance / edgeMax,
                            5
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
                            5
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
                  drawAnimatedPathV2({
                    paths: paths.map(({ path }) => [path[i], path[i + 1]]),
                    ctx: ctx!,
                    extraDraw,
                    speed: 1000,
                    lastFrame: i == numberPoints - 2,
                    canvas: canvas.current!,
                    colour: `rgba(43,207,207,${opacity})`,
                    completionColour,
                    plotPreviousPath: false,
                    points,
                    previousPaths: paths.map(({ path }) =>
                      path.slice(0, i + 2)
                    ),
                    bestPath,
                    antImage,
                  });
                }, i * (visualiseHeadEdges ? 1000 : 500));
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
              });
            }
          } else {
            paths?.forEach(({ path }) => {
              plotPath(path, ctx!, lastFrame ? completionColour : colour, true);
            });
          }

          plotPoints(points, ctx!);

          timeouts.shift();
        } else {
          timeouts.forEach((timeout: any) => {
            clearTimeout(timeout);
          });
          algorithmFinished();
        }

        if (lastFrame) {
          algorithmFinished();
        }
      }, index * speed)
    );
  });
};

export default VisualiseAlgorithm;
