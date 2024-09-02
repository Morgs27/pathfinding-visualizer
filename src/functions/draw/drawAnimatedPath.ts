import Point from "../../types/Point";
import { calcWaypoints } from "../helpers";
import { clearCanvas, getCanvas, plotPath, plotPoints } from "./draw";

type DrawAnimatedPathProps = {
  path: Point[];
  ctx: CanvasRenderingContext2D;
  speed: number;
  extraDraw: any;
  lastFrame: boolean;
  canvas: HTMLCanvasElement;
  colour: string;
  completionColour: string;
  hideMarker: boolean;
};

function drawAnimatedPath({
  path,
  ctx,
  extraDraw,
  speed,
  lastFrame,
  canvas,
  colour,
  completionColour,
  hideMarker,
}: DrawAnimatedPathProps) {
  ctx = ctx || getCanvas();

  if (path.length > 1) {
    plotPath(path.slice(0, -1), ctx, colour, hideMarker);
  }

  const mainLineWaypoints = calcWaypoints([
    path[path.length - 2],
    path[path.length - 1],
  ]);

  const extraDrawWaypoints = extraDraw.map((edge: any) => {
    return { ...edge, waypoints: calcWaypoints(edge.path) };
  });

  let startTime: number | null = null;

  function drawInterval(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const progress = (timestamp - startTime) / speed;

    if (lastFrame) {
      drawPath(mainLineWaypoints, ctx!, progress, colour, 3);
    } else {
      if (progress < 0.5) {
        const mainProgress = progress / 0.5; // Scale progress to [0, 1] for the first 50%
        drawPath(mainLineWaypoints, ctx!, mainProgress, colour, 3);
      } else {
        const extraProgress = (progress - 0.5) / 0.5; // Scale progress to [0, 1] for the last 50%
        extraDrawWaypoints.forEach((edge: any) => {
          drawPath(edge.waypoints, ctx!, extraProgress, edge.colour, 1);
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
      plotPath(path, ctx!, completionColour, hideMarker);
      plotPoints(path, ctx!, hideMarker);
    }, speed + 100);
  }

  requestAnimationFrame(drawInterval);
}

function drawPath(
  waypoints: Point[],
  ctx: CanvasRenderingContext2D,
  progress: number,
  strokeStyle: string,
  lineWidth: number
) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  waypoints[0] && ctx.moveTo(waypoints[0].x, waypoints[0].y);
  for (let i = 1; i < waypoints.length * progress; i++) {
    if (waypoints[i]) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
  }
  ctx.stroke();
}

export default drawAnimatedPath;
