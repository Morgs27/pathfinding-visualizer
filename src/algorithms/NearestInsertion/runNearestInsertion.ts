import AlgorithmRunFunctionProps from "../../types/AlgorithmRunFunctionProps";
import { clearCanvas, plotPath, plotPoints } from "../../functions/DrawFunctions";
import point from "../../types/Point";
import { generateEdges } from "../../functions/helpers";

function runNearestInsertionAlgorithm({
  result,
  points,
  canvas,
  ctx,
  running,
  setTotalDistance,
  algorithmFinished,
  speed,
}: AlgorithmRunFunctionProps) {
  const [frames, solutionCost] = result;

  const allEdges = generateEdges(points);

  const edgeMax = allEdges.reduce((max, edge) => {
    return Math.max(max, edge.distance);
  }, 0);

  var timeouts: any = [];

  console.table(frames);

  // Loop through all permutations showing them for 10ms
  frames.forEach((path: point[], index: number) => {
    timeouts.push(
      setTimeout(() => {
        if (running.current) {
          clearCanvas(canvas.current!, ctx!);
          const pointSet = new Set(
            path.map((point) => `${point.x},${point.y}`)
          );
          allEdges.forEach((edge) => {
            const point1Key = `${edge.point1.x},${edge.point1.y}`;
            const point2Key = `${edge.point2.x},${edge.point2.y}`;
            if (pointSet.has(point1Key) || pointSet.has(point2Key)) {
              const otherPointKey = pointSet.has(point1Key)
                ? point2Key
                : point1Key;
              if (!pointSet.has(otherPointKey)) {
                const opacity = Math.pow(1 - edge.distance / edgeMax, 8);
                plotPath(
                  [edge.point1, edge.point2],
                  ctx!,
                  "rgba(255,255,255," + opacity + ")",
                  false
                );
              }
            }
          });
          plotPoints(points, ctx!);
          plotPath(path, ctx!, undefined, true);

          timeouts.shift();
        } else {
          timeouts.forEach((timeout: any) => {
            clearTimeout(timeout);
          });
          algorithmFinished();
        }

        if (index == frames.length - 1) {
          // Set total distance
          setTotalDistance(Math.floor(solutionCost));

          algorithmFinished();
        }
      }, index * 20 * speed)
    );
  });
}

export default runNearestInsertionAlgorithm;
