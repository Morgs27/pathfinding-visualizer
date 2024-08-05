// Nearest Insertion, O(n^2)
//     1. Select the shortest edge, and make a subtour
//     of it.
//     2. Select a city not in the subtour, having the
//     shortest distance to any one of the cities in
//     the subtoor.
//     3. Find an edge in the subtour such that the
//     cost of inserting the selected city between the
//     edge's cities will be minimal.
//     4. Repeat step 2 until no more cities remain.

import Point from "../types/Point";
import { distance, getRandomPoint, pathCost } from "../functions/helpers";
import { Frame } from "../functions/runAlgorithm";

async function nearestInsertionAlgorithm(pointsParam: Point[]) {
  const points = [...pointsParam];
  const path = [{ ...getRandomPoint(points), solved: true }];
  const frames: Frame[] = [];

  // Sort the remaining points based on their distance to the first point in the path
  points.sort((a, b) => distance(path[0], b) - distance(path[0], a));

  const nextPoint = points.pop() ?? points[0];

  path.push({ ...nextPoint, solved: true });
  frames.push({
    paths: [
      {
        path: [...path],
        distance: await pathCost(path),
      },
    ],
    distance: await pathCost(path),
  });

  // Loop until all points are added to the path
  while (points.length > 0) {
    let selectedIdx: number | null = null;
    let selectedDistance = Infinity;

    // Find the point with the shortest distance to any point in the current path
    points.forEach((freePoint, freePointIdx) => {
      path.forEach((pathPoint) => {
        const dist = distance(freePoint, pathPoint);
        if (dist < selectedDistance) {
          selectedDistance = dist;
          selectedIdx = freePointIdx;
        }
      });
    });

    // Remove the selected point from the points array
    const [nextPoint] = points.splice(selectedIdx!, 1);

    let bestIdx: number | null = null;
    let bestCost = Infinity;

    // Find the best position to insert the selected point in the path
    for (let i = 1; i < path.length; i++) {
      const insertionCost = await pathCost([path[i - 1], nextPoint, path[i]]);
      if (insertionCost < bestCost) {
        bestCost = insertionCost;
        bestIdx = i;
      }
    }

    // Insert the selected point at the best position in the path and mark it as solved
    path.splice(bestIdx!, 0, { ...nextPoint, solved: true });

    frames.push({
      paths: [
        {
          path: [...path],
          distance: await pathCost(path),
        },
      ],
      distance: await pathCost(path),
    });
  }

  frames.push({
    paths: [
      {
        path: [...path],
        distance: await pathCost(path),
      },
    ],
    distance: await pathCost(path),
  });
  return frames;
}

export default nearestInsertionAlgorithm;
