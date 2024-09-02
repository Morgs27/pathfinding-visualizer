import Point from "../types/Point";
import { pathCost } from "../functions/helpers";
import { Frame } from "../functions/visualiseAlgorithm";

// Convex Hull Algorithm - Finds the smallest convex polygon that can enclose all points

function orientation(p: Point, q: Point, r: Point): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0; // collinear
  return val > 0 ? 1 : 2; // clock or counterclock wise
}

async function convexHullAlgorithm(pointsParam: Point[]) {
  const points: Point[] = [...pointsParam];
  const frames: Frame[] = [];

  const startingPoint = points[0];

  // Find the "left most point"
  let leftmost = points[0];
  for (const point of points) {
    if (point.x < leftmost.x) {
      leftmost = point;
    }
  }

  // Start the path with the leftmost point
  const path = [leftmost];
  frames.push({
    paths: [
      {
        path: [...path],
        distance: null,
      },
    ],
    distance: null,
  });

  // Continually add the most counterclockwise point until the convex hull is formed
  while (true) {
    const curPoint = path[path.length - 1];
    let [selectedIdx, selectedPoint] = [0, points[0]];

    // Find the "most counterclockwise" point
    for (let [idx, p] of points.entries()) {
      if (!selectedPoint || orientation(curPoint, p, selectedPoint) === 2) {
        [selectedIdx, selectedPoint] = [idx, p];
      }
    }

    points.splice(selectedIdx, 1);

    if (selectedPoint === leftmost) {
      break;
    }

    path.push(selectedPoint!);
    frames.push({
      paths: [
        {
          path: [...path],
          distance: null,
        },
      ],
      distance: null,
    });
  }

  // Add the remaining points to the hull
  while (points.length > 0) {
    let [bestRatio, bestPointIdx, insertIdx] = [Infinity, 0, 0];

    for (let [freeIdx, freePoint] of points.entries()) {
      let [bestCost, bestIdx] = [Infinity, 0];
      for (let [pathIdx, pathPoint] of path.entries()) {
        const nextPathPoint = path[(pathIdx + 1) % path.length];

        const evalCost =
          (await pathCost([pathPoint, freePoint, nextPathPoint])) -
          (await pathCost([pathPoint, nextPathPoint]));

        if (evalCost < bestCost) {
          [bestCost, bestIdx] = [evalCost, pathIdx];
        }
      }

      const nextPoint = path[(bestIdx + 1) % path.length];
      const prevCost = await pathCost([path[bestIdx], nextPoint]);
      const newCost = await pathCost([path[bestIdx], freePoint, nextPoint]);
      const ratio = newCost / prevCost;

      if (ratio < bestRatio) {
        [bestRatio, bestPointIdx, insertIdx] = [ratio, freeIdx, bestIdx + 1];
      }
    }

    const [nextPoint] = points.splice(bestPointIdx, 1);
    path.splice(insertIdx, 0, nextPoint);

    frames.push({
      paths: [
        {
          path: [...path],
          distance: null,
        },
      ],
      distance: null,
    });
  }

  // Rotate the array so that starting point is back first
  const startIdx = path.findIndex((p) => p === startingPoint);
  path.unshift(...path.splice(startIdx, path.length));

  path.push(startingPoint);
  frames.push({
    paths: [
      {
        path: [...path],
        distance: null,
      },
    ],
    distance: null,
  });

  return frames;
}

export default convexHullAlgorithm;
