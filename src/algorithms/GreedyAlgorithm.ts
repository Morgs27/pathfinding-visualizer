import Point from "../types/Point";
import { distance } from "../functions/helpers";
import Edge from "../types/Edge";
import { Frame } from "../functions/runAlgorithm";

type pointConnection = {
  point: Point;
  connections: number;
};

// Greedy Algorithm
// Time Complexity - O(n^2log2(n))
// Within 15 - 20% of the Held-Karp lower bound
function greedyAlgorithm(points_array: Point[]) {
  // Set N to number of points
  const N = points_array.length;

  // Setup array to hold all edges
  const edges: Edge[] = [];
  const completeEdges: Edge[] = [];

  const frames: Frame[] = [];

  // Setup array to hold information about point connections
  const pointConnections: pointConnection[] = points_array.map((point) => {
    return { point: point, connections: 0 };
  });

  ///// Get all edges

  // Loop through all points
  points_array.forEach((point1, index1) => {
    // Get all points to be connected to current point
    var points_to_be_connected: Point[] = points_array.slice(index1 + 1);

    // Loop through points to be connected
    points_to_be_connected.forEach((point2, index2) => {
      // Add edge to edges array
      var edge = {
        point1: point1,
        point1Index: index1,
        point2: point2,
        point2Index: index1 + 1 + index2,
        distance: distance(point1, point2),
        added: false,
      };
      edges.push(edge);
    });
  });

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

  // Add Edge Code Block
  while (completeEdges.length < N - 1) {
    var edgeAdded = false;
    var index = 0;

    while (!edgeAdded) {
      index += 1;

      var edge = edges[index];

      // Check edge is not already added
      if (edge.added) {
      }

      // Check that neither point in edge already has 2 connections
      else if (
        pointConnections[edge.point1Index ?? 0].connections == 2 ||
        pointConnections[edge.point2Index ?? 0].connections == 2
      ) {
      }

      // Check that adding this edge dosen't cause a closed cycle (unless this is the last edge to be added)
      else if (checkClosedLoop([...completeEdges, edge])) {
      }

      //  If all guards are passed add point
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

  // add an edge between the only two points with connection = 1
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
    const pairsToBeTraversed = pairs.slice(); // copy the array
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
