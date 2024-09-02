import { useCallback } from "react";
import { Stat, defaultStats } from "../config/Stats";
import algorithms from "../config/Algorithms";
import AntColonyOptions from "../types/AntColonyOptions";
import Point from "../types/Point";

type UseResetStatsProps = {
  setStats: React.Dispatch<React.SetStateAction<Stat[]>>;
  currentAlgorithm: number;
  antColonyOptions: AntColonyOptions;
  points: Point[];
};

const useResetStats = ({
  setStats,
  currentAlgorithm,
  antColonyOptions,
  points,
}: UseResetStatsProps) => {
  const resetStats = useCallback(() => {
    setStats(
      algorithms[currentAlgorithm].stats
        ?.map((statID) => {
          const defaultStat = defaultStats.find((stat) => stat.id === statID);
          const defaultValue = defaultStat?.defaultValue;
          const value =
            statID == "ants"
              ? antColonyOptions.numAnts
              : statID == "iteration"
              ? antColonyOptions.numIterations
              : points.length;
          return defaultStat
            ? {
                ...defaultStat,
                value: defaultValue ? defaultValue(value) : 0,
              }
            : null;
        })
        .filter((stat) => stat !== null) as Stat[]
    );
  }, [setStats, currentAlgorithm, antColonyOptions, points]);

  return resetStats;
};

export default useResetStats;
