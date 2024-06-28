import AlgorithmRunFunctionProps from "../../types/AlgorithmRunFunctionProps";
import point from "../../types/Point";
import { distance } from "../../functions/helpers";
import { plotPoints, plotPath, clearCanvas } from "../../functions/DrawFunctions";

// Run/Diplay Brute Force Algorithm
async function runBruteForceAlgorithm({
  result,
  points,
  setTotalPermutations,
  setTotalDistance,
  algorithmFinished,
  running,
  canvas,
  ctx,
  setCurrentPermutation,
  speed,
}: AlgorithmRunFunctionProps & {
  setTotalPermutations: (value: number) => void;
  setCurrentPermutation: (value: number) => void;
}) {
  const [solution, permutations] = result;

  setTotalPermutations(permutations.length);

  // Add Solution to end of list
  permutations.push(solution);

  var counter = -1;

  var timeouts: any = [];

  // Loop through all permutations showing them for 10ms
  permutations.forEach((path: point[], index: number) => {
    timeouts.push(
      setTimeout(() => {
        if (index == 0) {
          // Calculation Complete
        }

        if (running.current) {
          counter += 1;
          clearCanvas(canvas.current!, ctx!);
          plotPath(path, ctx!);
          plotPoints(points, ctx!);
          setCurrentPermutation(counter);
          timeouts.shift();
        } else {
          timeouts.forEach((timeout: any) => {
            clearTimeout(timeout);
          });
          algorithmFinished();
        }

        // When the algorithm is completed displaying
        if (index == permutations.length - 1) {
          // Calculate distance between all points
          let totalDistance = 0;
          solution.forEach((point: point, index: number) => {
            if (index != 0) {
              totalDistance += distance(point, solution[index - 1]);
            }
          });

          // Set total distance
          setTotalDistance(Math.floor(totalDistance));

          algorithmFinished();
        }
      }, index * 2 * speed)
    );
  });
}

export default runBruteForceAlgorithm;
