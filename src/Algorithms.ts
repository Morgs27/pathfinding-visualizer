import runAntColonyAlgorithm from "./algorithms/AntColony/runAntColonyAlgorithm";
import runNearestNeighborAlgorithm from "./algorithms/NearestNeighbor/runNearestNeighborAlgorithm";
import runGreedyAlgorithm from "./algorithms/Greedy/runGreedyAlgorithm";
import runNearestInsertionAlgorithm from "./algorithms/NearestInsertion/runNearestInsertion";
import runConvexHullAlgorithm from "./algorithms/ConvexHull/runConvexHullAlgorithm";
import runBruteForceAlgorithm from "./algorithms/BruteForce/runBruteForceAlgorithm";

import antColonyAlgorithm from "./algorithms/AntColony/AntColonyAlgorithm";
import nearestNeighborAlgorithm from "./algorithms/NearestNeighbor/NearestNeighborAlgorithm";
import greedyAlgorithm from "./algorithms/Greedy/GreedyAlgorithm";
import nearestInsertionAlgorithm from "./algorithms/NearestInsertion/NearestInsertion";
import convexHullAlgorithm from "./algorithms/ConvexHull/ConvexHullAlgorithm";
import bruteForceAlgorithm from "./algorithms/BruteForce/BruteForceAlgorithm";

// Algorithm Information
const algorithms = [
  {
    name: "Ant Colony Optimization",
    runFunction: runAntColonyAlgorithm,
    calculateFunction: antColonyAlgorithm,
    timeComplexity: "null",
    accuracy: "null",
  },
  {
    name: "Nearest Neighbour",
    runFunction: runNearestNeighborAlgorithm,
    calculateFunction: nearestNeighborAlgorithm,
    timeComplexity: "O(n^2)",
    accuracy: "75%",
  },
  {
    name: "Greedy",
    runFunction: runGreedyAlgorithm,
    calculateFunction: greedyAlgorithm,
    timeComplexity: "O(n^2log_2(n))",
    accuracy: "80-85%",
  },
  {
    name: "Nearest Insertion",
    runFunction: runNearestInsertionAlgorithm,
    calculateFunction: nearestInsertionAlgorithm,
    timeComplexity: "O(n^2)",
    accuracy: "null",
  },
  {
    name: "Convex Hull Insertion",
    runFunction: runConvexHullAlgorithm,
    calculateFunction: convexHullAlgorithm,
    timeComplexity: "O(n^2log_2(n))",
    accuracy: "null",
  },
  {
    name: "Brute Force",
    runFunction: runBruteForceAlgorithm,
    calculateFunction: bruteForceAlgorithm,
    timeComplexity: "O(n!)",
    accuracy: "100%",
  },
];

export default algorithms;
