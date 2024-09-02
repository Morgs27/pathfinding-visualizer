import Edge from "../../types/Edge";
import { plotPath } from "./draw";
import { generateEdges } from "../helpers";
import { Path } from "../visualiseAlgorithm";

export const getHeadEdges = (
  paths: Path[],
  allEdges: Edge[],
  edgeMax: number
) => {
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

export const drawCloseEdges = (
  paths: Path[],
  allEdges: Edge[],
  ctx: CanvasRenderingContext2D,
  edgeMax: number,
  hideMarker: boolean
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
        const opacity = Math.pow(1 - edge.distance / edgeMax, 12);
        plotPath(
          [edge.point1, edge.point2],
          ctx!,
          "rgba(255,255,255," + opacity + ")",
          hideMarker,
          2
        );
      }
    }
  });
};

export const drawAllPossibleEdges = (
  paths: Path[],
  allEdges: Edge[],
  ctx: CanvasRenderingContext2D,
  edgeMax: number,
  hideMarker: boolean
) => {
  const pathEdges = paths.map(({ path }) => generateEdges(path));

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
      hideMarker,
      2
    );
  });
};
