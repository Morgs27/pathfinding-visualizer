// Brute Force Algorithm - Try all possible compinations
// Guarantees Shortest Distance

import point from "../../types/Point";
import { distance, swap } from "../../functions/helpers";
import { Frame } from "../runAlgorithm";

// Time complexity O(n!)
async function bruteForceAlgorithm(points: point[]) {
  // Set Initial Min Distance
  var bestDistance = getSolutionDistance(points);

  // Set Initial Solution to given points order
  var solution = points;

  // Create all permutations of the points array
  const permutations = heapsPermute(points);

  // Heaps Algorithm - Generates all possible permutations of points array
  function heapsPermute(array: point[], n?: number, results: Frame[] = []) {
    n = n || array.length;
    if (n === 1) {
      const path = array.slice();
      path.push(path[0]); // Join the two endpoints
      results.push({ path, distance: null });

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
  function getSolutionDistance(points_array: point[]) {
    var solutionDistance = 0;

    points_array.forEach((point, index) => {
      var nextIndex = (index + 1) % points_array.length;
      solutionDistance += distance(point, points_array[nextIndex]);
    });

    return solutionDistance;
  }

  // Evaluate solution
  function evaluateSolution(points_array: point[]) {
    var solutionDistance = getSolutionDistance(points_array);

    if (solutionDistance < bestDistance) {
      bestDistance = solutionDistance;
      solution = points_array;
    }
  }

  // Add connection back to original point
  solution.push(solution[0]);

  permutations.push({ path: solution, distance: bestDistance });

  return permutations;
}

export default bruteForceAlgorithm;
