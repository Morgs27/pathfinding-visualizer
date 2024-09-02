import Point from "../types/Point";
import { distance, generateEdges } from "../functions/helpers";
import Edge from "../types/Edge";
import { Frame } from "../functions/visualiseAlgorithm";

type pointConnection = {
  point: Point;
  connections: number;
};

// Greedy Algorithm - Adds the shortest edge to the path until the path is complete

function greedyAlgorithm(points_array: Point[]) {
  const completeEdges: Edge[] = [];
  const frames: Frame[] = [];

  const N = points_array.length;

  const pointConnections: pointConnection[] = points_array.map((point) => {
    return { point: point, connections: 0 };
  });

  const edges = generateEdges(points_array);

  // Sort edges by distance
  edges.sort((a, b) => {
    return a.distance - b.distance;
  });

  // Add shortest edge to start
  pointConnections[edges[0].point1Index ?? 0].connections += 1;
  pointConnections[edges[0].point2Index ?? 0].connections += 1;
  edges[0].added = true;
  completeEdges.push(edges[0]);
  frames.push({
    paths: completeEdges.map((edge) => ({
      path: [edge.point1, edge.point2],
      distance: edge.distance,
    })),
    distance: null,
  });

  // Add Edges
  while (completeEdges.length < N - 1) {
    var edgeAdded = false;
    var index = 0;

    while (!edgeAdded) {
      index += 1;

      var edge = edges[index];

      // Check edge is not already added
      if (edge.added) {
        continue;
      }

      // Check that neither point in edge already has 2 connections
      else if (
        pointConnections[edge.point1Index ?? 0].connections == 2 ||
        pointConnections[edge.point2Index ?? 0].connections == 2
      ) {
      }

      // Check that adding this edge dosen't cause a closed cycle
      else if (checkClosedLoop([...completeEdges, edge])) {
      }

      // Add Point
      else {
        pointConnections[edge.point1Index ?? 0].connections += 1;
        pointConnections[edge.point2Index ?? 0].connections += 1;
        edges[index].added = true;

        completeEdges.push(edge);
        frames.push({
          paths: completeEdges.map((edge) => ({
            path: [edge.point1, edge.point2],
            distance: edge.distance,
          })),
          distance: edge.distance,
        });
        edgeAdded = true;
      }
    }
  }

  const finalEdge = getFinalEdge(pointConnections);
  completeEdges.push(finalEdge);
  frames.push({
    paths: completeEdges.map((edge) => ({
      path: [edge.point1, edge.point2],
      distance: edge.distance,
    })),
    distance: null,
  });

  return frames;
}

// Function to check if adding an edge will cause a closed loop
function checkClosedLoop(some_edges: Edge[]) {
  const pairs = some_edges.map((edge) => [edge.point1Index, edge.point2Index]);

  for (let i = 0; i < pairs.length; i++) {
    const [start, end] = pairs[i];
    const pairsToBeTraversed = pairs.slice();
    pairsToBeTraversed.splice(i, 1);

    let targetValue = start;
    let finding = true;

    while (finding) {
      finding = false;

      for (let j = 0; j < pairsToBeTraversed.length; j++) {
        const [a, b] = pairsToBeTraversed[j];

        if (a === targetValue || b === targetValue) {
          targetValue = a === targetValue ? b : a;
          pairsToBeTraversed.splice(j, 1);
          finding = true;
          j--;

          if (targetValue === end) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function getFinalEdge(pointConnections: pointConnection[]) {
  const pointsToConnect = pointConnections.filter(
    (point: pointConnection) => point.connections === 1
  );

  const point1 = pointsToConnect[0].point;
  const point2 = pointsToConnect[1].point;

  return {
    point1: point1,
    point2: point2,
    distance: distance(point1, point2),
    added: true,
  };
}

export default greedyAlgorithm;
