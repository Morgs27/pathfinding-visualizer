/// Draw Functions ///

import edge from "../types/Edge";
import point from "../types/Point";

export function getCanvas() {
  // Get Canvas Element
  const canvasElm = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvasElm?.getContext("2d");

  return ctx;
}

export function plotPoints(
  points_array: point[],
  ctx: CanvasRenderingContext2D
) {
  ctx = ctx || getCanvas();

  var markerObjWhite = new Image();
  markerObjWhite.src = "./location-dot-white.png";

  var markerObjOrange = new Image();
  markerObjOrange.src = "./location-dot-orange.png";

  // Draw Each Point
  points_array.forEach((point: point) => {
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

  // Clear Canvas
  ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
}

export function plotPath(
  path_points: point[],
  ctx: CanvasRenderingContext2D,
  colour?: string,
  shouldPlotPoints: boolean = true
) {
  ctx = ctx || getCanvas();

  colour = colour || "orange";

  ctx.lineWidth = colour === "orange" ? 3 : 2;

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
  start: point,
  end: point,
  ctx: CanvasRenderingContext2D,
  colour?: string
) {
  ctx = ctx || getCanvas();

  colour = colour || "orange";

  ctx.lineWidth = 2;
  ctx.strokeStyle = colour;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function calcWaypoints(vertices: point[]) {
  var waypoints = [];
  var totalDistance = 0;

  // Calculate total distance
  for (var i = 1; i < vertices.length; i++) {
    var dx = vertices[i].x - vertices[i - 1].x;
    var dy = vertices[i].y - vertices[i - 1].y;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
  }

  // Calculate waypoints proportional to distance
  for (var i = 1; i < vertices.length; i++) {
    var pt0 = vertices[i - 1];
    var pt1 = vertices[i];
    var dx = pt1.x - pt0.x;
    var dy = pt1.y - pt0.y;
    var segmentDistance = Math.sqrt(dx * dx + dy * dy);
    var numWaypoints = Math.floor((segmentDistance / totalDistance) * 1000); // Adjust 1000 as needed

    for (var j = 0; j < numWaypoints; j++) {
      var x = pt0.x + (dx * j) / numWaypoints;
      var y = pt0.y + (dy * j) / numWaypoints;
      waypoints.push({ x: x, y: y });
    }
  }

  return waypoints;
}

export function drawAnimatedPath(
  path_points: point[],
  ctx: CanvasRenderingContext2D,
  colour: string = "orange",
  shouldPlotPoints: boolean = true,
  duration: number = 200
) {
  ctx = ctx || getCanvas();

  ctx.lineWidth = colour === "orange" ? 3 : 2;
  ctx.strokeStyle = colour;

  let startTime: number | null = null;
  const waypoints = calcWaypoints(path_points);

  function drawbla(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const progress = (timestamp - startTime) / duration;

    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);

    const currentPointIndex = Math.min(
      Math.floor(progress * waypoints.length),
      waypoints.length - 1
    );

    for (let i = 1; i <= currentPointIndex; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }

    ctx.stroke();

    if (progress < 1) {
      requestAnimationFrame(drawbla);
    } else if (shouldPlotPoints) {
      plotPoints(path_points, ctx);
    }
  }

  requestAnimationFrame(drawbla);
}

interface DrawFrameProps {
  frameDuration: number;
  path: point[];
  extraDraw: any;
  points: point[];
  ctx: any;
  canvas: any;
}

export const drawFrame = ({
  frameDuration,
  path,
  extraDraw,
  points,
  ctx,
  canvas,
}: DrawFrameProps) => {
  ctx = ctx || getCanvas();

  clearCanvas(canvas, ctx);

  console.log(extraDraw);

  var markerObjWhite = new Image();
  markerObjWhite.src = "./location-dot-white.png";

  points.forEach((point: point) => {
    const size = { w: 20, h: 30 };

    ctx.drawImage(
      markerObjWhite,
      point.x - size.w / 2,
      point.y - size.h,
      size.w,
      size.h
    );
  });

  if (path.length > 1) {
    plotPath(path.slice(0, -1), ctx, undefined, false);
  }

  const mainLineWaypoints = calcWaypoints([
    path[path.length - 2],
    path[path.length - 1],
  ]);

  const reOrder = (extraPath: point[]) => {
    const startingPoint = path[path.length - 1];
    if (extraPath[0] != startingPoint) {
      return [extraPath[1], extraPath[0]];
    }
    return extraPath;
  };

  const extraDrawWaypoints = extraDraw.map((edge: any) => {
    return { ...edge, waypoints: calcWaypoints(reOrder(edge.path)) };
  });

  let startTime: number | null = null;

  function drawInterval(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const progress = (timestamp - startTime) / frameDuration;

    if (progress < 0.5) {
      // Draw the main path in the first 70%
      const mainProgress = progress / 0.5; // Scale progress to [0, 1] for the first 70%
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(mainLineWaypoints[0].x, mainLineWaypoints[0].y);
      for (let i = 1; i < mainLineWaypoints.length * mainProgress; i++) {
        ctx.lineTo(mainLineWaypoints[i].x, mainLineWaypoints[i].y);
      }
      ctx.stroke();
    } else {
      // Draw the extra edges in the last 30%
      const extraProgress = (progress - 0.5) / 0.5; // Scale progress to [0, 1] for the last 30%
      extraDrawWaypoints.forEach((edge: any) => {
        ctx.strokeStyle = edge.colour;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(edge.waypoints[0].x, edge.waypoints[0].y);
        for (let i = 1; i < edge.waypoints.length * extraProgress; i++) {
          ctx.lineTo(edge.waypoints[i].x, edge.waypoints[i].y);
        }
        ctx.stroke();
      });
    }

    if (progress < 1) {
      requestAnimationFrame(drawInterval);
    }
  }

  requestAnimationFrame(drawInterval);

  plotPoints(points, ctx);
};
