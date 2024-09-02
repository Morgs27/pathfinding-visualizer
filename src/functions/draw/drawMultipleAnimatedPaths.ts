import Point from "../../types/Point";
import { calcWaypoints } from "../helpers";
import { clearCanvas, getCanvas, plotPath, plotPoints } from "./draw";
import { Path } from "../visualiseAlgorithm";

type DrawAnimatedPathProps = {
  paths: Point[][];
  ctx: CanvasRenderingContext2D;
  speed: number;
  extraDraw: any;
  lastFrame: boolean;
  canvas: HTMLCanvasElement;
  colour: string;
  completionColour: string;
  plotPreviousPath?: boolean;
  points?: Point[];
  previousPaths?: Point[][];
  bestPath?: Path;
  antImage?: HTMLImageElement;
  antColour?: string;
  hideMarker?: boolean;
};

function drawMultipleAnimatedPaths({
  paths,
  ctx,
  extraDraw,
  speed,
  lastFrame,
  canvas,
  colour,
  completionColour,
  plotPreviousPath = true,
  points = paths[0],
  previousPaths = [],
  bestPath = { path: [], distance: 0 },
  antImage,
  hideMarker = true,
}: DrawAnimatedPathProps) {
  ctx = ctx || getCanvas();

  const mainLineWaypoints = paths.map((path) =>
    calcWaypoints([path[0], path[path.length - 1]])
  );

  const extraDrawWaypoints = extraDraw.map((edge: any) => {
    return { ...edge, waypoints: calcWaypoints(edge.path) };
  });

  let startTime: number | null = null;

  function drawInterval(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const progress = (timestamp - startTime) / speed;

    clearCanvas(canvas, ctx!);

    previousPaths.forEach((path) => {
      if (progress < 0.5 || lastFrame) {
        plotPath(path.slice(0, -1), ctx, colour, hideMarker);
      } else {
        plotPath(path, ctx, colour, hideMarker);
      }
    });

    plotPoints(points, ctx!, hideMarker);

    if (lastFrame) {
      mainLineWaypoints.forEach((waypoints) => {
        drawPath(waypoints, ctx!, progress, colour, 3, true, antImage);
      });
    } else {
      if (progress < 0.5) {
        const mainProgress = progress / 0.5;
        mainLineWaypoints.forEach((waypoints) => {
          drawPath(waypoints, ctx!, mainProgress, colour, 3, true, antImage);
        });
      } else {
        const extraProgress = (progress - 0.5) / 0.5;
        extraDrawWaypoints.forEach((edge: any) => {
          drawPath(
            edge.waypoints,
            ctx!,
            extraProgress,
            edge.colour,
            1,
            false,
            antImage
          );
        });
      }
    }

    if (progress < 1) {
      requestAnimationFrame(drawInterval);
    }
  }

  if (lastFrame) {
    setTimeout(() => {
      clearCanvas(canvas, ctx!);

      plotPath(bestPath.path, ctx!, completionColour, hideMarker);
      plotPoints(bestPath.path, ctx!, hideMarker);
    }, speed + 100);
  }

  requestAnimationFrame(drawInterval);
}

function drawPath(
  waypoints: Point[],
  ctx: CanvasRenderingContext2D,
  progress: number,
  strokeStyle: string,
  lineWidth: number,
  isAnt: boolean,
  antImage?: HTMLImageElement
) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  waypoints[0] && ctx.moveTo(waypoints[0].x, waypoints[0].y);

  const maxIndex = Math.floor(waypoints.length * progress);

  for (let i = 1; i < maxIndex; i++) {
    if (waypoints[i]) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
  }
  ctx.stroke();

  const antPoint = isAnt ? waypoints[maxIndex] : waypoints[0];
  if (antPoint) {
    const nextPoint = waypoints[maxIndex + 1] || waypoints[maxIndex];
    const angle = isAnt
      ? Math.atan2(nextPoint.y - antPoint.y, nextPoint.x - antPoint.x) -
        Math.PI / 2
      : 0;

    ctx.save();
    ctx.translate(antPoint.x, antPoint.y);
    ctx.rotate(angle);
    ctx.drawImage(antImage!, -10, -10, 20, 20);
    ctx.restore();
  }
}

export default drawMultipleAnimatedPaths;
