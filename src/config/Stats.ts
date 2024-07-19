import { factorialize } from "../functions/helpers";

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
  | "iterations"
  | "ants"
  | "bestPath";

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
  { id: "iterations", name: "Iterations", value: null },
  {
    id: "ants",
    name: "Ants",
    value: null,
    defaultValue: (number: number) => 10,
  },
  { id: "bestPath", name: "Best Path", value: null, unit: "px" },
];
