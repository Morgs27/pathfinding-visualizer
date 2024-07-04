import { Path } from "./runAlgorithm";
import Edge from "../types/Edge";
import Point from "../types/Point";

const getHeadEdges = (paths: Path[], allEdges: Edge[], edgeMax: number) => {
  const reOrder = (extraPath: Point[]) => {
    const startingPoint = extraPath[0];
    if (extraPath[0] != startingPoint) {
      return [extraPath[1], extraPath[0]];
    }
    return extraPath;
  };

  const lastPoint =
    paths[paths.length - 1].path[paths[paths.length - 1].path.length - 1];

  return allEdges
    .map((edge) => {
      const point1Key = `${edge.point1.x},${edge.point1.y}`;
      const point2Key = `${edge.point2.x},${edge.point2.y}`;

      if (
        point1Key === `${lastPoint.x},${lastPoint.y}` ||
        point2Key === `${lastPoint.x},${lastPoint.y}`
      ) {
        const opacity = Math.pow(1 - edge.distance / edgeMax, 4);
        return {
          path: reOrder([edge.point1, edge.point2]),
          colour: "rgba(255,255,255," + opacity + ")",
        };
      }
      return null;
    })
    .filter((edge) => edge !== null);
};

export default getHeadEdges;
