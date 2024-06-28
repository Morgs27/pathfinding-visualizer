// Run/Display Greedy Algorithm Algorithm
import AlgorithmRunFunctionProps from "../../types/AlgorithmRunFunctionProps";
import {
  clearCanvas,
  plotPath,
  plotPoints,
} from "../../functions/DrawFunctions";
import edge from "../../types/Edge";

function runGreedyAlgorithm({
  result,
  points,
  canvas,
  ctx,
  running,
  setTotalDistance,
  algorithmFinished,
  speed,
}: AlgorithmRunFunctionProps) {

  const [edges, allEdges] = result;

  // Create array to hold all the frames
  var timeouts: any[] = [];

  // Loop through path edges
  edges.forEach((edge: edge, index: number) => {
    // Create frame and add to array
    timeouts.push(
      setTimeout(() => {
        // If algorithm is running
        if (running.current) {
          // Add distance of current edge to total
          setTotalDistance((distance: number) =>
            Math.floor(distance + edge.distance)
          );

          let currentPath = edges.filter((edge: edge, filterIndex: number) => {
            return filterIndex <= index;
          });

          let prevPath = edges.filter((edge: edge, filterIndex: number) => {
            return filterIndex < index;
          });

          // Loop through all possible edges between points
          // Display a line between them proportional to the distance
          allEdges.forEach((edge: edge, allEdgesIndex: number) => {
            let opacity = Math.pow(1 - allEdgesIndex / allEdges.length, 4) / 4;
            plotPath(
              [edge.point1, edge.point2],
              ctx!,
              "rgba(255,255,255," + opacity + ")",
              false
            );
          });

          // Plot all the lines completed in previous frames
          prevPath.forEach((edge: edge) => {
            plotPath([edge.point1, edge.point2], ctx!);
          });

          // After a delay plot the next edge
          setTimeout(() => {
            clearCanvas(canvas.current!, ctx!);

            currentPath.forEach((edge: edge) => {
              if (
                currentPath.filter(
                  (e: edge) => e.point1 === edge.point1 || e.point2 === edge.point1
                ).length > 1
              ) {
                edge.point1.solved = true;
              }
              if (
                currentPath.filter(
                  (e: edge) => e.point1 === edge.point2 || e.point2 === edge.point2
                ).length > 1
              ) {
                edge.point2.solved = true;
              }
            });

            // Plot all the points
            plotPoints(points, ctx!);

            currentPath.forEach((edge: edge) => {
              plotPath([edge.point1, edge.point2], ctx!);
            });
          }, 10 * speed);

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
      }, index * 10 * speed)
    );
  });
}

export default runGreedyAlgorithm;
