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
