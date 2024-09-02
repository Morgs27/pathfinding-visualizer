import { clearCanvas, plotPoints } from "./draw/draw";
import VisualiseAlgorithm from "./visualiseAlgorithm";
import algorithms from "../config/Algorithms";
import Record from "../types/Record";
import Point from "../types/Point";
import { Stat } from "../config/Stats";
import AntColonyOptions from "../types/AntColonyOptions";

export const algorithmSetup = (
  points: Point[],
  setErrorMessage: (message: string | null) => void,
  currentAlgorithm: number,
  setLoading: (loading: boolean) => void,
  setMenuOpen: (menuOpen: boolean) => void,
  isMobile: boolean,
  setPoints: (points: Point[]) => void,
  canvas: React.RefObject<HTMLCanvasElement>,
  ctx: CanvasRenderingContext2D | null,
  showPoints: boolean,
  running: React.MutableRefObject<boolean>,
  setRunningState: (running: boolean) => void,
  resetStats: () => void
) => {
  if (points.length == 0) {
    setErrorMessage("Please add some points to the screen");
    return;
  }

  if (currentAlgorithm == 5 && points.length > 11) {
    setErrorMessage(
      "Due to performance issues the Brute Force algorithm is limited to 10 points"
    );
    return;
  }

  setLoading(true);
  setMenuOpen(!isMobile);

  setPoints(points.map((point) => ({ ...point, solved: false })));
  clearCanvas(canvas.current!, ctx!);
  plotPoints(points, ctx!, !showPoints);

  running.current = true;
  setRunningState(true);

  resetStats();
};

export const runAlgorithm = async (
  currentAlgorithm: number,
  antColonyOptions: AntColonyOptions,
  points: Point[],
  setLoading: (loading: boolean) => void,
  canvas: React.RefObject<HTMLCanvasElement>,
  ctx: CanvasRenderingContext2D | null,
  running: React.MutableRefObject<boolean>,
  algorithmFinished: () => void,
  speed: number,
  theme: { colour: string; completionColour: string },
  showExtraLines: boolean,
  setStats: (stats: Stat[]) => void,
  stats: Stat[],
  setHistory: (history: Record[]) => void,
  history: Record[],
  showPoints: boolean
) => {
  const options = currentAlgorithm == 0 ? antColonyOptions : {};

  const frames = await algorithms[currentAlgorithm].calculateFunction!(
    [...points],
    options
  );

  setLoading(false);

  VisualiseAlgorithm({
    frames,
    points,
    canvas,
    ctx: ctx!,
    running,
    algorithmFinished,
    speed,
    ...algorithms[currentAlgorithm].runOptions,
    colour: theme.colour,
    completionColour: theme.completionColour,
    showExtraLines,
    numberOfPoints: points.length,
    setStats,
    stats,
    setHistory,
    history,
    currentAlgorithm,
    antColonyOptions,
    hideMarkers: !showPoints,
  });
};

export const setupReRunAlgorithm = (
  record: Record,
  setCurrentAlgorithm: (algorithm: number) => void,
  running: React.MutableRefObject<boolean>,
  reRunAlgorithm: (record: Record) => void,
  resetStats: () => void,
  setMenuOpen: (menuOpen: boolean) => void,
  isMobile: boolean,
  setPoints: (points: Point[]) => void
) => {
  setCurrentAlgorithm(record.algorithmIndex);
  running.current = true;
  reRunAlgorithm(record);
  resetStats();
  setMenuOpen(!isMobile);
  setPoints(record.points);
  setTimeout(() => {
    if (running.current == false) {
      reRunAlgorithm(record);
    }
  }, 400);
};

export const reRunAlgorithm = (
  record: Record,
  canvas: React.RefObject<HTMLCanvasElement>,
  ctx: CanvasRenderingContext2D | null,
  running: React.MutableRefObject<boolean>,
  algorithmFinished: () => void,
  speed: number,
  theme: { colour: string; completionColour: string },
  showExtraLines: boolean,
  setStats: (stats: Stat[]) => void,
  stats: Stat[],
  setHistory: (history: Record[]) => void,
  history: Record[],
  antColonyOptions: AntColonyOptions,
  showPoints: boolean
) => {
  VisualiseAlgorithm({
    frames: record.frames,
    points: record.points,
    canvas,
    ctx: ctx!,
    running,
    algorithmFinished,
    speed,
    ...algorithms[record.algorithmIndex].runOptions,
    colour: theme.colour,
    completionColour: theme.completionColour,
    showExtraLines,
    numberOfPoints: record.points.length,
    setStats,
    stats,
    setHistory,
    history,
    currentAlgorithm: record.algorithmIndex,
    antColonyOptions,
    hideMarkers: !showPoints,
  });
};
