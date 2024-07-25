import { factorialize } from "../functions/helpers";
import AntColonyOptions from "../types/AntColonyOptions";
import { GiAnt } from "react-icons/gi";
import { GrCycle } from "react-icons/gr";
import { GiPathDistance } from "react-icons/gi";
import { GiCycle } from "react-icons/gi";
import { TbLocationCheck } from "react-icons/tb";

export type Stat = {
  id: StatID;
  name: string;
  value: number | null;
  unit?: string;
  defaultValue?: (number: number) => number;
  icon?: React.ReactNode;
  showName?: boolean;
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
  {
    id: "currentPermutation",
    name: "Current Permutation",
    value: null,
    showName: true,
  },
  {
    id: "totalPermutations",
    name: "Total Permutations",
    value: null,
    defaultValue: (number: number) => factorialize(number),
    showName: true,
  },
  {
    id: "totalDistance",
    name: "Total Distance",
    value: null,
    unit: "px",
    icon: <GiPathDistance />,
    showName: false,
  },
  {
    id: "completedEdges",
    name: "Completed Edges",
    value: null,
    icon: <TbLocationCheck />,
    showName: false,
  },
  {
    id: "completedPoints",
    name: "Completed Points",
    value: null,
    icon: <TbLocationCheck />,
    showName: false,
  },
  {
    id: "solvedPoints",
    name: "Solved Points",
    value: null,
    icon: <TbLocationCheck />,
    showName: false,
  },
  {
    id: "iteration",
    name: "Iteration",
    value: null,
    defaultValue: (number: number) => number,
    icon: <GiCycle />,
    showName: false,
  },
  {
    id: "ants",
    name: "Ants",
    value: null,
    defaultValue: (number: number) => number,
    icon: <GiAnt />,
    showName: false,
  },
  {
    id: "bestPath",
    name: "Best Path",
    value: null,
    unit: "px",
    icon: <GiPathDistance />,
    showName: false,
  },
  {
    id: "pointsExplored",
    name: "Points Explored",
    value: null,
    icon: <TbLocationCheck />,
    showName: false,
  },
];
