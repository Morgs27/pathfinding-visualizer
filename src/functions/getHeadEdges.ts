import { Path } from "./runAlgorithm";
import Edge from "../types/Edge";
import Point from "../types/Point";

const getHeadEdges = (paths: Path[], allEdges: Edge[], edgeMax: number) => {
  const lastPath = paths[paths.length - 1];
  const lastPoint = lastPath.path[lastPath.path.length - 1];

  const headEdges = allEdges
    .map((edge) => {
      const isConnectedToLastPoint =
        edge.point1 === lastPoint || edge.point2 === lastPoint;
      const isConnectedToOtherPoints = paths.some(
        (path) =>
          path.path.includes(edge.point1) && path.path.includes(edge.point2)
      );
      if (isConnectedToLastPoint && !isConnectedToOtherPoints) {
        const opacity = Math.pow(1 - edge.distance / edgeMax, 10);
        return {
          path: [edge.point1, edge.point2],
          colour: "rgba(255,255,255," + opacity + ")",
        };
      } else {
        return null;
      }
    })
    .filter((edge) => edge !== null);

  return headEdges;
};

export default getHeadEdges;
