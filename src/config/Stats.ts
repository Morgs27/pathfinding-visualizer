import { factorialize } from "../functions/helpers";
import AntColonyOptions from "../types/AntColonyOptions";

export type Stat = {
  id: StatID;
  name: string;
  value: number | null;
  unit?: string;
  defaultValue?: (number: number) => number;
};

export type StatID =
  | "currentPermutation"
  | "totalPermutations"
  | "totalDistance"
  | "completedEdges"
  | "completedPoints"
  | "solvedPoints"
  | "iteration"
  | "ants"
  | "bestPath"
  | "pointsExplored";

export const defaultStats: Stat[] = [
  { id: "currentPermutation", name: "Current Permutation", value: null },
  {
    id: "totalPermutations",
    name: "Total Permutations",
    value: null,
    defaultValue: (number: number) => factorialize(number),
  },
  { id: "totalDistance", name: "Total Distance", value: null, unit: "px" },
  { id: "completedEdges", name: "Completed Edges", value: null },
  { id: "completedPoints", name: "Solved Points", value: null },
  { id: "solvedPoints", name: "Solved Points", value: null },
  { id: "iteration", name: "Iteration", value: null },
  {
    id: "ants",
    name: "Ants",
    value: null,
    defaultValue: (number: number) => number,
  },
  { id: "bestPath", name: "Best Path", value: null, unit: "px" },
  { id: "pointsExplored", name: "Points Explored", value: null },
];
