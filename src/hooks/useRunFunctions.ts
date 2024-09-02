import { useCallback } from "react";
import {
  algorithmSetup,
  runAlgorithm,
  setupReRunAlgorithm,
  reRunAlgorithm,
} from "../functions/runAlgorithm";
import Record from "../types/Record";
import Point from "../types/Point";
import { Stat } from "../config/Stats";
import AntColonyOptions from "../types/AntColonyOptions";

const useRunFunctions = (
  points: Point[],
  setErrorMessage: (message: string | null) => void,
  currentAlgorithm: number,
  setCurrentAlgorithm: (algorithm: number) => void,
  setLoading: (loading: boolean) => void,
  setMenuOpen: (menuOpen: boolean) => void,
  isMobile: boolean,
  setPoints: (points: Point[]) => void,
  canvas: React.RefObject<HTMLCanvasElement>,
  ctx: CanvasRenderingContext2D | null,
  showPoints: boolean,
  running: React.MutableRefObject<boolean>,
  setRunningState: (running: boolean) => void,
  resetStats: () => void,
  antColonyOptions: AntColonyOptions,
  speed: number,
  theme: { colour: string; completionColour: string },
  showExtraLines: boolean,
  setStats: (stats: Stat[]) => void,
  stats: Stat[],
  setHistory: (history: Record[]) => void,
  history: Record[]
) => {
  const handleAlgorithmSetup = useCallback(() => {
    algorithmSetup(
      points,
      setErrorMessage,
      currentAlgorithm,
      setLoading,
      setMenuOpen,
      isMobile,
      setPoints,
      canvas,
      ctx,
      showPoints,
      running,
      setRunningState,
      resetStats
    );
  }, [points, currentAlgorithm, isMobile, showPoints, canvas, ctx]);

  const handleRunAlgorithm = useCallback(async () => {
    await runAlgorithm(
      currentAlgorithm,
      antColonyOptions,
      points,
      setLoading,
      canvas,
      ctx,
      running,
      algorithmFinished,
      speed,
      theme,
      showExtraLines,
      setStats,
      stats,
      setHistory,
      history,
      showPoints
    );
  }, [
    currentAlgorithm,
    antColonyOptions,
    points,
    speed,
    theme,
    showExtraLines,
    showPoints,
  ]);

  const handleSetupReRunAlgorithm = useCallback(
    (record: Record) => {
      setupReRunAlgorithm(
        record,
        setCurrentAlgorithm,
        running,
        handleReRunAlgorithm,
        resetStats,
        setMenuOpen,
        isMobile,
        setPoints
      );
    },
    [isMobile]
  );

  const handleReRunAlgorithm = useCallback(
    (record: Record) => {
      reRunAlgorithm(
        record,
        canvas,
        ctx,
        running,
        algorithmFinished,
        speed,
        theme,
        showExtraLines,
        setStats,
        stats,
        setHistory,
        history,
        antColonyOptions,
        showPoints
      );
    },
    [canvas, ctx, speed, theme, showExtraLines, showPoints, antColonyOptions]
  );

  const algorithmFinished = useCallback(() => {
    running.current = false;
    setRunningState(false);
  }, []);

  return {
    handleAlgorithmSetup,
    handleRunAlgorithm,
    handleSetupReRunAlgorithm,
    handleReRunAlgorithm,
    algorithmFinished,
  };
};

export default useRunFunctions;
