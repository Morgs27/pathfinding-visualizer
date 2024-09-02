import Point from "../types/Point";
import { distance, swap } from "../functions/helpers";
import { Frame } from "../functions/visualiseAlgorithm";

// Brute Force Algorithm - Try all possible compinations - Guarantees Shortest Distance

async function bruteForceAlgorithm(points: Point[]) {
  var bestDistance = getSolutionDistance(points);
  var solution = points;

  // Heaps Algorithm - Generates all possible permutations of points array
  const permutations = heapsPermute(points);
  function heapsPermute(array: Point[], n?: number, results: Frame[] = []) {
    n = n || array.length;
    if (n === 1) {
      const path = array.slice();
      path.push(path[0]); // Join the two endpoints
      results.push({
        paths: [
          {
            path,
            distance: null,
          },
        ],
        distance: null,
      });

      evaluateSolution(path);
    } else {
      for (var i = 1; i <= n; i += 1) {
        heapsPermute(array, n - 1, results);

        if (n % 2) {
          var j = 1;
        } else {
          var j = i;
        }
        swap(array, j - 1, n - 1);
      }
    }
    return results;
  }

  // Get total distance for a solution
  function getSolutionDistance(points_array: Point[]) {
    var solutionDistance = 0;

    points_array.forEach((point, index) => {
      var nextIndex = (index + 1) % points_array.length;
      solutionDistance += distance(point, points_array[nextIndex]);
    });

    return solutionDistance;
  }

  // Evaluate solution
  function evaluateSolution(points_array: Point[]) {
    var solutionDistance = getSolutionDistance(points_array);

    if (solutionDistance < bestDistance) {
      bestDistance = solutionDistance;
      solution = points_array;
    }
  }

  // Add connection back to original point
  solution.push(solution[0]);

  permutations.push({
    paths: [
      {
        path: solution,
        distance: bestDistance,
      },
    ],
    distance: bestDistance,
  });

  return permutations;
}

export default bruteForceAlgorithm;
