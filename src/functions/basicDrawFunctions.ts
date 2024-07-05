/// Draw Functions ///
import Point from "../types/Point";

export function getCanvas() {
  const canvasElm = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvasElm?.getContext("2d");

  return ctx;
}

export function plotPoints(
  points_array: Point[],
  ctx: CanvasRenderingContext2D
) {
  ctx = ctx || getCanvas();

  var markerObjWhite = new Image();
  markerObjWhite.src = "./location-dot-white.png";

  var markerObjOrange = new Image();
  markerObjOrange.src = "./location-dot-orange.png";

  points_array.forEach((point: Point) => {
    // var thisMarker = point.solved ? markerObjOrange : markerObjWhite;
    var thisMarker = point.solved ? markerObjWhite : markerObjWhite;

    const size = { w: 20, h: 30 };

    ctx.drawImage(
      thisMarker,
      point.x - size.w / 2,
      point.y - size.h,
      size.w,
      size.h
    );
  });
}

export function clearCanvas(
  canvasElm: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx = ctx || getCanvas();

  ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
}

export function plotPath(
  path_points: Point[],
  ctx: CanvasRenderingContext2D,
  colour?: string,
  shouldPlotPoints: boolean = true,
  lineWidth?: number
) {
  ctx = ctx || getCanvas();

  colour = colour ?? "white";

  ctx.lineWidth = lineWidth ?? 3;

  ctx.strokeStyle = colour;
  ctx.beginPath();
  ctx.moveTo(path_points[0].x, path_points[0].y);
  for (const point of path_points) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();

  if (shouldPlotPoints) {
    plotPoints(path_points, ctx);
  }
}

export function plotLine(
  start: Point,
  end: Point,
  ctx: CanvasRenderingContext2D,
  colour?: string
) {
  ctx = ctx || getCanvas();

  colour = colour || "white";

  ctx.lineWidth = 2;
  ctx.strokeStyle = colour;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}
