import {
  clearCanvas,
  plotLine,
  plotPath,
  plotPoints,
} from "../../functions/DrawFunctions";
import point from "../../types/Point";
import AlgorithmRunFunctionProps from "../../types/AlgorithmRunFunctionProps";
import { distance } from "../../functions/helpers";

// Run/Diplay Nearest Neighbor Algorithm
function runNearestNeighborAlgorithm({
  result,
  points,
  canvas,
  ctx,
  running,
  setTotalDistance,
  algorithmFinished,
  speed,
}: AlgorithmRunFunctionProps) {
  // Run the algorithm
  const [steps, path] = result;

  // Create an idendical array to points
  const points_array: point[] = points.map((point) => {
    return { ...point, solved: false };
  });

  // Setup array to hold the points in the completed path
  var completed_path: point[] = [];

  // Setup array to hold all the timeouts/frames
  var timeouts: any[] = [];

  // Loop through all the points in the path
  path.forEach((pointIndex: number, index: number) => {
    // Create frame then add to timeouts array
    timeouts.push(
      setTimeout(() => {
        // If running
        if (running.current) {
          // Add current point to the completed path
          completed_path.push(points_array[pointIndex]);

          clearCanvas(canvas.current!, ctx!);

          // Plot the so far completed path
          plotPath(completed_path, ctx!, "orange");

          // If not on the last point
          if (index != path.length - 1) {
            // Add distance to total
            if (completed_path.length > 1) {
              setTotalDistance(
                (prevDistance: number) =>
                  prevDistance +
                  Math.floor(
                    distance(completed_path.at(-1)!, completed_path.at(-2)!)
                  )
              );
            }

            var stepDistances = steps[index][0];
            var minDistance = steps[index][1];

            // Display a line for each of the options from the current point
            // with opacity proportionalized to the distance
            stepDistances.forEach((distance: number | null, index: number) => {
              if (distance != null) {
                var lineStrength = Math.pow(
                  Math.round((1 / (distance / minDistance)) * 100) / 100,
                  4
                );

                var colour = "rgba(255,255,255," + lineStrength + ")";

                plotLine(
                  points_array[pointIndex],
                  points_array[index],
                  ctx!,
                  colour
                );
              }
            });
          }

          // Set current point to solved and update the points
          points_array[pointIndex].solved = true;
          plotPoints(points_array, ctx!);

          // Remove current frame from list of frames
          timeouts.shift();
        } else {
          // If algorithm is stopped
          // Clear all the frames that are still to run
          timeouts.forEach((timeout: any) => {
            clearTimeout(timeout);
          });
          algorithmFinished();
        }

        // If all the frames have ran end the algorithm
        if (timeouts.length == 0) {
          algorithmFinished();
        }
      }, index * 15 * speed)
    );
  });
}

export default runNearestNeighborAlgorithm;
