import point from "../types/Point";
import { distance } from "../functions/helpers";
import edge from "../types/Edge";

type pointConnection = {
  point: point;
  connections: number;
};

// Greedy Algorithm
// Time Complexity - O(n^2log2(n))
// Within 15 - 20% of the Held-Karp lower bound
export function greedyAlgorithm(points_array: point[]) {
  // Set N to number of points
  const N = points_array.length;

  // Setup array to hold all edges
  const edges: edge[] = [];
  const completeEdges: edge[] = [];

  // Setup array to hold information about point connections
  const pointConnections: pointConnection[] = points_array.map((point) => {
    return { point: point, connections: 0 };
  });

  ///// Get all edges

  // Loop through all points
  points_array.forEach((point1, index1) => {
    // Get all points to be connected to current point
    var points_to_be_connected: point[] = points_array.slice(index1 + 1);

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
        edgeAdded = true;
      }
    }
  }

  return [completeEdges, edges];
}
// Function to check if adding an edge will cause a closed loop
function checkClosedLoop(some_edges: edge[]) {
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
