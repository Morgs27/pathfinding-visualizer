
/// Draw Functions ///

import { point } from "./App";

export function plotPoints(points_array: point[]){

  // Get Canvas Element
  const canvaseElm = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvaseElm?.getContext("2d");
    
  // Draw Each Point
  points_array.forEach((point: point) => {

    point.solved?ctx.fillStyle = "orange":ctx.fillStyle = "white"
    ctx.beginPath();
    ctx.arc(point.x, point.y, 7, 0, 2 * Math.PI);
    ctx.fill();

  })

}

export function clearCanvas(){

  // Get Canvas Element
  const canvaseElm = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvaseElm?.getContext("2d");

  // Clear Canvas
  ctx.clearRect(0, 0, canvaseElm.width, canvaseElm.height);
}

export function plotPath(path_points: point[], colour?: string){

  colour = colour || 'orange'

  // Get Canvas Element
  const canvaseElm = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvaseElm?.getContext("2d");

  ctx.lineWidth = 2;
  ctx.strokeStyle = colour;
  ctx.beginPath();
  ctx.moveTo(path_points[0].x, path_points[0].y);
  for (const point of path_points) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
  
}

export function plotLine(start: point, end: point, colour?: string){
    
  colour = colour || 'orange'

    // Get Canvas Element
    const canvaseElm = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvaseElm?.getContext("2d");

    ctx.lineWidth = 2;
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

}