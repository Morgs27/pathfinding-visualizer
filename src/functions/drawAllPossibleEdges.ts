import { Path } from "./runAlgorithm";
import Edge from "../types/Edge";
import { plotPath } from "./basicDrawFunctions";
import { generateEdges } from "./helpers";
import Point from "../types/Point";

const drawAllPossibleEdges = (
  paths: Path[],
  allEdges: Edge[],
  ctx: CanvasRenderingContext2D,
  edgeMax: number
) => {
  const pathEdges = paths.map(({ path }) => generateEdges(path));

  // Not this is not quite perfect as it only works assuming points x values are unique
  // Used because it's more performant
  // In the future a point ID should be used to avoid this issue
  const pointConnections: { [key: number]: number } = {};
  pathEdges.forEach((edges) => {
    edges.forEach((edge) => {
      pointConnections[edge.point1.x] =
        (pointConnections[edge.point1.x] || 0) + 1;
      pointConnections[edge.point2.x] =
        (pointConnections[edge.point2.x] || 0) + 1;
    });
  });

  const possibleEdges = allEdges.filter(
    (edge) =>
      !(
        pointConnections[edge.point1.x] == 2 ||
        pointConnections[edge.point2.x] == 2
      )
  );

  possibleEdges.forEach((edge: Edge) => {
    const normalizedDistance = edge.distance / edgeMax;

    const opacity = Math.pow(1 - normalizedDistance, 10);
    plotPath(
      [edge.point1, edge.point2],
      ctx!,
      "rgba(255,255,255," + opacity + ")",
      false,
      2
    );
  });
};

export default drawAllPossibleEdges;
