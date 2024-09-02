import Point from "../types/Point";
import { distance } from "../functions/helpers";
import { Frame } from "../functions/visualiseAlgorithm";

// Nearest Neighbor Algorithm - Adds the point closest to the head of the path to the path

function nearestNeighborAlgorithm(points: Point[]) {
  var startingIndex = 0;
  var steps: Frame[] = [];

  var path: any = [startingIndex];
  points[startingIndex].solved = true;

  var pathSolved = false;
  while (!pathSolved) {
    var currentPoint = points[path[path.length - 1]];
    var stepDistances: (number | null)[] = [];
    var nextPointIndex: number | null = null;
    var minDistance = Infinity;

    // For each point that is not solved find the distance between the points
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

    // If no point is found, the path is solved
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
    } else {
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
