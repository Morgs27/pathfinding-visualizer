import { MutableRefObject } from "react";
import Point from "../types/Point";
import {
  drawAnimatedPath,
  clearCanvas,
  plotPath,
  plotPoints,
  drawFrame,
} from "../functions/DrawFunctions";
import { generateEdges, pathCost } from "../functions/helpers";
import edge from "../types/Edge";

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
};

export type Frame = {
  path: Point[] | null;
  distance: number | null;
  paths?: edge[];
};

const VisualiseAlgorithm = async ({
  points,
  canvas,
  ctx,
  frames,
  speed = 3000,
  running,
  setTotalDistance,
  algorithmFinished,
  calculateDistances = false,
  result,
  setCurrentPermutation = () => {},
  visualiseCloseEdges = false,
  visualiseAllPossibleEdges = false,
  visualiseHeadEdges = false,
  animatePath = false,
}: VisualiseAlgorithmProps) => {
  if (result) {
    frames = result;
  }

  speed = 20 * speed;

  console.log(speed);

  if (calculateDistances) {
    frames = await Promise.all(
      frames.map(async (frame: Frame) => {
        const distance = Math.floor(
          frame.paths
            ? frame.paths.reduce((acc, curr) => acc + curr.distance, 0)
            : await pathCost(frame.path ?? [])
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

  frames.forEach(({ path, distance, paths }, index: number) => {
    timeouts.push(
      setTimeout(async () => {
        if (running.current) {
          setTotalDistance(distance ?? 0);
          setCurrentPermutation(index);

          /// Draw Frame ///
          clearCanvas(canvas.current!, ctx!);

          let extraDraw;

          //   if (visualiseCloseEdges) {
          //     drawCloseEdges(path ?? [], allEdges, ctx!, edgeMax);
          //   }

          //   if (visualiseAllPossibleEdges) {
          //     drawAllPossibleEdges(path ?? [], allEdges, ctx!, edgeMax, paths);
          //   }

          if (visualiseHeadEdges) {
            extraDraw = await getHeadEdges(path ?? [], allEdges, ctx!, edgeMax);
          }

          drawFrame({
            frameDuration: speed,
            path: path ?? [],
            points,
            extraDraw,
            ctx,
            canvas,
          });

          timeouts.shift();
        } else {
          timeouts.forEach((timeout: any) => {
            clearTimeout(timeout);
          });
          algorithmFinished();
        }

        if (index == frames.length - 1) {
          algorithmFinished();
        }
      }, index * speed)
    );
  });
};

const getHeadEdges = async (
  path: Point[],
  allEdges: edge[],
  ctx: CanvasRenderingContext2D,
  edgeMax: number
) => {
  const pointSet = new Set(path.map((point) => `${point.x},${point.y}`));
  const lastPoint = path[path.length - 1];

  return Promise.all(
    allEdges
      .map((edge) => {
        const point1Key = `${edge.point1.x},${edge.point1.y}`;
        const point2Key = `${edge.point2.x},${edge.point2.y}`;

        if (
          (point1Key === `${lastPoint.x},${lastPoint.y}` &&
            !pointSet.has(point2Key)) ||
          (point2Key === `${lastPoint.x},${lastPoint.y}` &&
            !pointSet.has(point1Key))
        ) {
          const opacity = Math.pow(1 - edge.distance / edgeMax, 4);
          return {
            path: [edge.point1, edge.point2],
            colour: "rgba(255,255,255," + opacity + ")",
          };
        }
        return null;
      })
      .filter((edge) => edge !== null)
  );
};

const drawAllPossibleEdges = (
  path: Point[],
  allEdges: edge[],
  ctx: CanvasRenderingContext2D,
  edgeMax: number,
  paths?: edge[]
) => {
  const pathEdges = paths ?? generateEdges(path);
  const pathEdgeMax = pathEdges.reduce((max, edge) => {
    return Math.max(max, edge.distance);
  }, 0);

  console.log(pathEdgeMax, edgeMax);

  if (edgeMax - pathEdgeMax * 2 < 0) {
    return;
  }

  allEdges.forEach((edge: edge) => {
    const normalizedDistance = edge.distance / (edgeMax - pathEdgeMax * 2);

    const opacity = Math.pow(1 - normalizedDistance, 3);
    plotPath(
      [edge.point1, edge.point2],
      ctx!,
      "rgba(255,255,255," + opacity + ")",
      false
    );
  });
};

const drawCloseEdges = (
  path: Point[],
  allEdges: edge[],
  ctx: CanvasRenderingContext2D,
  edgeMax: number
) => {
  const pointSet = new Set(
    (path ?? []).map((point) => `${point.x},${point.y}`)
  );
  allEdges.forEach((edge) => {
    const point1Key = `${edge.point1.x},${edge.point1.y}`;
    const point2Key = `${edge.point2.x},${edge.point2.y}`;
    if (pointSet.has(point1Key) || pointSet.has(point2Key)) {
      const otherPointKey = pointSet.has(point1Key) ? point2Key : point1Key;
      if (!pointSet.has(otherPointKey)) {
        const opacity = Math.pow(1 - edge.distance / edgeMax, 8);
        plotPath(
          [edge.point1, edge.point2],
          ctx!,
          "rgba(255,255,255," + opacity + ")",
          false
        );
      }
    }
  });
};

export default VisualiseAlgorithm;
