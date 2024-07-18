import Point from "../types/Point";
import calcWaypoints from "./calculateWaypoints";
import {
  clearCanvas,
  getCanvas,
  plotPath,
  plotPoints,
} from "./basicDrawFunctions";

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
};

function drawAnimatedPathV2({
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
}: DrawAnimatedPathProps) {
  ctx = ctx || getCanvas();

  paths.forEach((path) => {
    if (plotPreviousPath && path.length > 1) {
      plotPath(path.slice(0, -1), ctx, colour, false);
    }
  });

  console.log(previousPaths);

  const mainLineWaypoints = paths.map((path) =>
    calcWaypoints([path[0], path[path.length - 1]])
  );

  const extraDrawWaypoints = extraDraw.map((edge: any) => {
    return { ...edge, waypoints: calcWaypoints(edge.path) };
  });

  let startTime: number | null = null;

  function drawInterval(timestamp: number) {
    clearCanvas(canvas, ctx!);

    previousPaths.forEach((path) => {
      plotPath(path, ctx, "white", false);
    });

    plotPoints(points, ctx!);

    if (!startTime) startTime = timestamp;
    const progress = (timestamp - startTime) / speed;

    if (lastFrame) {
      mainLineWaypoints.forEach((waypoints) => {
        drawPath(waypoints, ctx!, progress, colour, 3);
      });
    } else {
      if (progress < 0.5) {
        const mainProgress = progress / 0.5;
        mainLineWaypoints.forEach((waypoints) => {
          drawPath(waypoints, ctx!, mainProgress, colour, 3);
        });
      } else {
        const extraProgress = (progress - 0.5) / 0.5;
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
      paths.forEach((path) => {
        plotPath(path, ctx!, completionColour, false);
        plotPoints(path, ctx!);
      });
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

  const maxIndex = Math.floor(waypoints.length * progress);

  for (let i = 1; i < maxIndex; i++) {
    if (waypoints[i]) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
  }
  ctx.stroke();

  // Draw a circle at the front of the line
  if (maxIndex < waypoints.length) {
    const frontPoint = waypoints[maxIndex];
    if (frontPoint) {
      ctx.beginPath();
      ctx.arc(frontPoint.x, frontPoint.y, lineWidth * 2, 0, 2 * Math.PI);
      ctx.fillStyle = strokeStyle;
      ctx.fill();
    }
  }
}

export default drawAnimatedPathV2;
