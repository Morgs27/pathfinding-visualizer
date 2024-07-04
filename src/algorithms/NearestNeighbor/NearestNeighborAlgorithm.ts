// Nearest Neighbor Algorithm
// Time Complexity - O(n^2)
// Within 25% of the Held-Karp lower bound

import Point from "../../types/Point";
import { distance } from "../../functions/helpers";
import { Frame } from "../../functions/runAlgorithm";

function nearestNeighborAlgorithm(points: Point[]) {
  // Generate random index for starting point
  var randomIndex = Math.floor(Math.random() * points.length);

  // Add first point to path
  var path: any = [randomIndex];

  // Setup array to hold info about each step to help with display
  var steps: Frame[] = [];

  // Set starting point to solved
  points[randomIndex].solved = true;

  // Start Recursive loop that ends when path is solved
  var pathSolved = false;
  while (!pathSolved) {
    // Get info on working point
    var currentPoint = points[path[path.length - 1]];

    // Setup array to hold distances between points
    var stepDistances: (number | null)[] = [];

    // Setup variable to hold index of the next point (closest point)
    var nextPointIndex: number | null = null;

    // Set minimum distance so number larger than it could possibly be
    var minDistance = 10000000;

    // For each point that is not solved find the distance between the points
    // If the distance is lower than the max
    // Update the next point and minimum distance
    points.forEach((point, index) => {
      if (point.solved != true) {
        var pointDistance = distance(currentPoint, point);

        stepDistances.push(pointDistance);

        if (pointDistance < minDistance) {
          nextPointIndex = index;
          minDistance = pointDistance;
        }
      } else {
        stepDistances.push(null);
      }
    });

    // If there are no more points that are not solved
    // Exit while loop and push path back to starting point
    if (nextPointIndex == null) {
      pathSolved = true;
      path.push(path[0]);
      steps.push({
        paths: [
          {
            path: path.map((index: number) => points[index]),
            distance: null,
          },
        ],
        distance: null,
      });
    }

    // If there are more points to be solved
    // Push current solved point
    else {
      points[nextPointIndex].solved = true;
      path.push(nextPointIndex);
      steps.push({
        paths: [
          {
            path: path.map((index: number) => points[index]),
            distance: null,
          },
        ],
        distance: null,
      });
    }
  }

  return steps;
}

export default nearestNeighborAlgorithm;
