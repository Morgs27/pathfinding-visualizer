import antColonyAlgorithm from "./algorithms/AntColony/AntColonyAlgorithm";
import nearestNeighborAlgorithm from "./algorithms/NearestNeighbor/NearestNeighborAlgorithm";
import greedyAlgorithm from "./algorithms/Greedy/GreedyAlgorithm";
import nearestInsertionAlgorithm from "./algorithms/NearestInsertion/NearestInsertion";
import convexHullAlgorithm from "./algorithms/ConvexHull/ConvexHullAlgorithm";
import bruteForceAlgorithm from "./algorithms/BruteForce/BruteForceAlgorithm";
import VisualiseAlgorithm, {
  Frame,
  VisualiseAlgorithmProps,
} from "./functions/runAlgorithm";
import point from "./types/Point";

export type Algorithms = {
  name: string;
  runOptions?: Partial<VisualiseAlgorithmProps>;
  calculateFunction: (points: point[]) => Frame[] | Promise<Frame[]>;
  timeComplexity: string;
  accuracy: string;
};

// Algorithm Information
const algorithms: Algorithms[] = [
  {
    name: "Ant Colony Optimization",
    runOptions: {
      visualiseAllPossibleEdges: true,
    },
    calculateFunction: antColonyAlgorithm,
    timeComplexity: "null",
    accuracy: "null",
  },
  {
    name: "Nearest Neighbour",
    runOptions: {
      visualiseHeadEdges: true,
      animatePath: true,
      calculateDistances: true,
    },
    calculateFunction: nearestNeighborAlgorithm,
    timeComplexity: "O(n^2)",
    accuracy: "75%",
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
  },
  {
    name: "Brute Force",
    calculateFunction: bruteForceAlgorithm,
    runOptions: {
      defaultSpeed: 10,
    },
    timeComplexity: "O(n!)",
    accuracy: "100%",
  },
];

export default algorithms;
