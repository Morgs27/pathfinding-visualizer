import { Path } from "./runAlgorithm";
import Edge from "../types/Edge";
import { plotPath } from "./basicDrawFunctions";
import { generateEdges } from "./helpers";

const drawAllPossibleEdges = (
  paths: Path[],
  allEdges: Edge[],
  ctx: CanvasRenderingContext2D,
  edgeMax: number
) => {
  const pathEdges = paths.map(({ path }) => generateEdges(path));
  const pathEdgeMax = pathEdges.reduce((max, edges) => {
    return Math.max(
      max,
      edges.reduce((max, edge) => {
        return Math.max(max, edge.distance);
      }, 0)
    );
  }, 0);

  if (edgeMax - pathEdgeMax * 2 < 0) {
    return;
  }

  allEdges.forEach((edge: Edge) => {
    const normalizedDistance = edge.distance / (edgeMax - pathEdgeMax * 2);

    const opacity = Math.pow(1 - normalizedDistance, 3);
    plotPath(
      [edge.point1, edge.point2],
      ctx!,
      "rgba(255,255,255," + opacity + ")",
      false
    );
  });
};

export default drawAllPossibleEdges;
