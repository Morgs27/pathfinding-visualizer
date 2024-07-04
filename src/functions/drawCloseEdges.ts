import { Path } from "./runAlgorithm";
import Edge from "../types/Edge";
import { plotPath } from "./basicDrawFunctions";

const drawCloseEdges = (
  paths: Path[],
  allEdges: Edge[],
  ctx: CanvasRenderingContext2D,
  edgeMax: number
) => {
  const pointSet = new Set(
    paths.map(({ path }) => path.map((point) => `${point.x},${point.y}`)).flat()
  );
  allEdges.forEach((edge) => {
    const point1Key = `${edge.point1.x},${edge.point1.y}`;
    const point2Key = `${edge.point2.x},${edge.point2.y}`;
    if (pointSet.has(point1Key) || pointSet.has(point2Key)) {
      const otherPointKey = pointSet.has(point1Key) ? point2Key : point1Key;
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
};

export default drawCloseEdges;
