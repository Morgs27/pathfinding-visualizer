import Point from "../types/Point";
import Edge from "../types/Edge";

export function distance(point1: Point, point2: Point) {
  return Math.sqrt(
    (point1.x - point2.x) * (point1.x - point2.x) +
      (point1.y - point2.y) * (point1.y - point2.y)
  );
}

export function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function swap(array: any, pos1: number, pos2: number) {
  var temp = array[pos1];
  array[pos1] = array[pos2];
  array[pos2] = temp;
}

export function factorialize(num: number) {
  if (num === 0 || num === 1) return 1;
  for (var i = num - 1; i >= 1; i--) {
    num *= i;
  }
  return num;
}

export function debounce<F extends (...args: any[]) => any>(
  this: any,
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export const generateEdges = (points: Point[]): Edge[] => {
  const edges: Edge[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      edges.push({
        point1Index: i,
        point2Index: j,
        distance: distance(points[i], points[j]),
        point1: points[i],
        point2: points[j],
        added: false,
      });
    }
  }
  return edges;
};

export const shortestEdge = (edges: Edge[]): Edge => {
  return edges.reduce((shortest, current) => {
    return current.distance < shortest.distance ? current : shortest;
  });
};

export const removeEdge = (edges: Edge[], edge: Edge) => {
  return edges.filter((e) => e !== edge);
};

export const getRandomPoint = (points: Point[]): Point => {
  return points[Math.floor(Math.random() * points.length)];
};

export async function pathCost(points: Point[]): Promise<number> {
  let cost = 0;
  for (let i = 1; i < points.length; i++) {
    cost += distance(points[i - 1], points[i]);
  }
  return cost;
}

export function calcWaypoints(vertices: Point[]) {
  var waypoints = [];
  var totalDistance = 0;

  for (var i = 1; i < vertices.length; i++) {
    var dx = vertices[i].x - vertices[i - 1].x;
    var dy = vertices[i].y - vertices[i - 1].y;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
  }

  for (var i = 1; i < vertices.length; i++) {
    var pt0 = vertices[i - 1];
    var pt1 = vertices[i];
    var dx = pt1.x - pt0.x;
    var dy = pt1.y - pt0.y;
    var segmentDistance = Math.sqrt(dx * dx + dy * dy);
    var numWaypoints = Math.floor((segmentDistance / totalDistance) * 100);

    for (var j = 0; j < numWaypoints; j++) {
      var x = pt0.x + (dx * j) / numWaypoints;
      var y = pt0.y + (dy * j) / numWaypoints;
      waypoints.push({ x: x, y: y });
    }
  }

  return waypoints;
}

export function setProperty(property: string, value: string) {
  document.documentElement.style.setProperty(property, value);
}
