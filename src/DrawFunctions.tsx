
/// Draw Functions ///

import { point } from "./App";

export function getCanvas(){

    // Get Canvas Element
    const canvasElm = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvasElm?.getContext("2d");

    return ctx;
}

export function plotPoints(points_array: point[], ctx: CanvasRenderingContext2D){

  ctx = getCanvas();

  var markerObjWhite = new Image();
  markerObjWhite.src = './location-dot-white.png'

  var markerObjOrange = new Image();
  markerObjOrange.src = './location-dot-orange.png'
    
  // Draw Each Point
  points_array.forEach((point: point) => {

    var thisMarker

    point.solved?thisMarker = markerObjOrange:thisMarker = markerObjWhite

    ctx.drawImage(thisMarker, point.x - 10, point.y - 30, 20, 30)

  })

}

export function clearCanvas(canvasElm:HTMLCanvasElement, ctx: CanvasRenderingContext2D){

  ctx = getCanvas();

  // Clear Canvas
  ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);

}

export function plotPath(path_points: point[],  ctx: CanvasRenderingContext2D, colour?: string){

  ctx = getCanvas();

  colour = colour || 'orange'

  ctx.lineWidth = 2;
  ctx.strokeStyle = colour;
  ctx.beginPath();
  ctx.moveTo(path_points[0].x, path_points[0].y);
  for (const point of path_points) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();

  plotPoints(path_points, ctx)
  
}

export function plotLine(start: point, end: point,ctx: CanvasRenderingContext2D, colour?: string){
    
  ctx = getCanvas();
  
  colour = colour || 'orange'

  ctx.lineWidth = 2;
  ctx.strokeStyle = colour;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

}