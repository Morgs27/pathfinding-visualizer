import { MutableRefObject } from "react";
import Point from "../types/Point";
import { clearCanvas, plotPath, plotPoints } from "./basicDrawFunctions";
import { generateEdges, pathCost } from "./helpers";
import drawAnimatedPath from "./drawAnimatedPath";
import getHeadEdges from "./getHeadEdges";
import drawAllPossibleEdges from "./drawAllPossibleEdges";
import drawCloseEdges from "./drawCloseEdges";

export type VisualiseAlgorithmProps = {
  points: Point[];
  canvas: MutableRefObject<HTMLCanvasElement | null>;
  ctx: CanvasRenderingContext2D | null;
  frames: Frame[];
  speed?: number;
  running: MutableRefObject<Boolean>;
  setTotalDistance: (distance: number) => void;
  algorithmFinished: () => void;
  calculateDistances?: boolean;
  result?: any;
  setCurrentPermutation?: (permutation: number) => void;
  visualiseCloseEdges?: boolean;
  visualiseAllPossibleEdges?: boolean;
  visualiseHeadEdges?: boolean;
  animatePath?: boolean;
  defaultSpeed?: number;
  colour?: string;
  completionColour?: string;
  showExtraLines?: boolean;
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
  setTotalDistance,
  algorithmFinished,
  calculateDistances = false,
  result,
  setCurrentPermutation = () => {},
  visualiseCloseEdges = false,
  visualiseAllPossibleEdges = false,
  animatePath = false,
  colour = "white",
  completionColour = "white",
  showExtraLines = false,
}: VisualiseAlgorithmProps) => {
  if (result) {
    frames = result;
  }

  speed = defaultSpeed * speed;

  if (calculateDistances) {
    frames = await Promise.all(
      frames.map(async (frame: Frame) => {
        const distance = Math.floor(
          (await Promise.all(frame.paths.map(async (curr) => await pathCost(curr.path) ?? 0)))
            .reduce((acc, curr) => acc + curr, 0)
        );
        return { ...frame, distance };
      })
    );
  }

  console.log(frames);

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
          setTotalDistance(Math.round(distance ?? 0));
          setCurrentPermutation(index);

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

          if (animatePath) {
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
