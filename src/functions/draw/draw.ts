import Point from "../../types/Point";

export function getCanvas() {
  const canvasElm = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvasElm?.getContext("2d");

  return ctx;
}

export function plotPoints(
  points_array: Point[],
  ctx: CanvasRenderingContext2D,
  hideMarkers: boolean = false
) {
  ctx = ctx || getCanvas();

  var markerObjWhite = new Image();
  markerObjWhite.src = "./location-dot-white.png";

  points_array.forEach((point: Point) => {
    const size = { w: 20, h: 30 };

    if (hideMarkers) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
      return;
    }

    ctx.drawImage(
      markerObjWhite,
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
  hideMarker: boolean = false,
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

  plotPoints(path_points, ctx, hideMarker);
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
