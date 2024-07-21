import antColonyAlgorithm from "../algorithms/AntColony/AntColonyAlgorithm";
import nearestNeighborAlgorithm from "../algorithms/NearestNeighbor/NearestNeighborAlgorithm";
import greedyAlgorithm from "../algorithms/Greedy/GreedyAlgorithm";
import nearestInsertionAlgorithm from "../algorithms/NearestInsertion/NearestInsertion";
import convexHullAlgorithm from "../algorithms/ConvexHull/ConvexHullAlgorithm";
import bruteForceAlgorithm from "../algorithms/BruteForce/BruteForceAlgorithm";
import { Frame, VisualiseAlgorithmProps } from "../functions/runAlgorithm";
import point from "../types/Point";
import { StatID } from "./Stats";
import AntColonyOptions from "../types/AntColonyOptions";

export type Algorithms = {
  name: string;
  runOptions?: Partial<VisualiseAlgorithmProps>;
  calculateFunction: (
    points: point[],
    options?: any
  ) => Frame[] | Promise<Frame[]>;
  timeComplexity: string;
  accuracy: string;
  stats?: StatID[];
};

// Algorithm Information
const algorithms: Algorithms[] = [
  {
    name: "Ant Colony Optimization",
    runOptions: {
      visualiseHeadEdges: true,
      animatePath: true,
      animate: true,
      calculateDistances: true,
    },
    calculateFunction: antColonyAlgorithm,
    timeComplexity: "null",
    accuracy: "null",
    stats: ["bestPath", "iteration", "ants", "pointsExplored"],
  },
  {
    name: "Nearest Neighbour",
    runOptions: {
      visualiseHeadEdges: true,
      animate: true,
      calculateDistances: true,
    },
    calculateFunction: nearestNeighborAlgorithm,
    timeComplexity: "O(n^2)",
    accuracy: "75%",
    stats: ["totalDistance", "solvedPoints"],
  },
  {
    name: "Greedy",
    runOptions: {
      visualiseAllPossibleEdges: true,
      calculateDistances: true,
    },
    calculateFunction: greedyAlgorithm,
    timeComplexity: "O(n^2log_2(n))",
    accuracy: "80-85%",
    stats: ["totalDistance", "completedEdges"],
  },
  {
    name: "Nearest Insertion",
    runOptions: {
      visualiseCloseEdges: true,
      visualiseAllPossibleEdges: false,
      calculateDistances: false,
    },
    calculateFunction: nearestInsertionAlgorithm,
    timeComplexity: "O(n^2)",
    accuracy: "null",
    stats: ["totalDistance", "completedPoints"],
  },
  {
    name: "Convex Hull Insertion",
    runOptions: {
      visualiseCloseEdges: true,
      visualiseAllPossibleEdges: false,
      calculateDistances: true,
    },
    calculateFunction: convexHullAlgorithm,
    timeComplexity: "O(n^2log_2(n))",
    accuracy: "null",
    stats: ["totalDistance", "completedPoints"],
  },
  {
    name: "Brute Force",
    calculateFunction: bruteForceAlgorithm,
    runOptions: {
      defaultSpeed: 10,
    },
    timeComplexity: "O(n!)",
    accuracy: "100%",
    stats: ["totalDistance", "currentPermutation", "totalPermutations"],
  },
];

export default algorithms;
