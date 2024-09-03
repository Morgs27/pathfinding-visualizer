import antColonyAlgorithm from "../algorithms/AntColonyAlgorithm";
import nearestNeighborAlgorithm from "../algorithms/NearestNeighborAlgorithm";
import greedyAlgorithm from "../algorithms/GreedyAlgorithm";
import nearestInsertionAlgorithm from "../algorithms/NearestInsertionAlgorithm";
import convexHullAlgorithm from "../algorithms/ConvexHullAlgorithm";
import bruteForceAlgorithm from "../algorithms/BruteForceAlgorithm";
import {
  Frame,
  VisualiseAlgorithmProps,
} from "../functions/visualiseAlgorithm";
import point from "../types/Point";
import { StatID } from "./Stats";

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

const algorithms: Algorithms[] = [
  {
    name: "Ant Colony Optimization",
    runOptions: {
      visualiseHeadEdges: true,
      animatePath: true,
      animate: true,
      calculateDistances: false,
    },
    calculateFunction: antColonyAlgorithm,
    timeComplexity: "null",
    accuracy: "null",
    stats: ["pointsExplored", "bestPath", "iteration", "ants"],
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
    stats: ["solvedPoints", "totalDistance"],
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
    stats: ["completedEdges", "totalDistance"],
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
    stats: ["completedPoints", "totalDistance"],
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
    stats: ["completedPoints", "totalDistance"],
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
