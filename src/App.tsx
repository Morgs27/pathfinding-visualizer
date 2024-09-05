import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-dropdown/style.css";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

/// --- Local Imports --- ///
import "./App.css";
import { getCanvas, plotPoints, clearCanvas } from "./functions/draw/draw";
import { LoadingText } from "./components/LoadingText/LoadingText";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import dimensions from "./types/Dimensions";
import point from "./types/Point";
import algorithms from "./config/Algorithms";
import themes, { Theme } from "./config/Themes";
import { debounce, setProperty } from "./functions/helpers";
import { Stat } from "./config/Stats";
import Record from "./types/Record";
import AntColonyOptions from "./types/AntColonyOptions";
import Config from "./config/config";
import { usePointsFunctions } from "./hooks/usePoints";
import useRunFunctions from "./hooks/useRunFunctions";
import useResetStats from "./hooks/useResetStats";
import Selector from "./components/Selector/Selector";
import Tutorial from "./components/Tutorial/Tutorial";
import AlgorithmSelector from "./components/AlgorithmSelector/AlgorithmSelector";
import HistoryRow from "./components/HistoryRow/HistoryRow";
import StatsRow from "./components/StatsRow/StatsRow";
import RunButton from "./components/RunButton/RunButton";
import ThemeSelector from "./components/ThemeSelector/ThemeSelector";
import OptionsSelector from "./components/OptionsSelector/OptionsSelector";

/// --- Icons --- ///
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { RxOpenInNewWindow } from "react-icons/rx";

const {
  MOBILE_BREAKPOINT,
  DEFAULT_DIMENSIONS,
  POINT_OPTIONS,
  ANT_OPTIONS,
  ITERATION_OPTIONS,
  SPEED_OPTIONS,
  GRID_BACKGROUND,
  DEFAULT_ANT_COLONY_OPTIONS,
  DEFAULT_MARGINS,
  MARGINS_WITH_POINTS,
  DEFAULT_SPEED,
  DEFAULT_THEME_INDEX,
  DEFAULT_ALGORITHM_INDEX,
} = Config;

const App = () => {
  // --- All State Is Stored Here --- //
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const screen = useRef<HTMLDivElement | null>(null);
  const running = useRef<boolean>(false);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(themes[DEFAULT_THEME_INDEX]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [history, setHistory] = useState<Record[]>([]);
  const [showPoints, setShowPoints] = useState(false);
  const [showExtraLines, setShowExtraLines] = useState(false);
  const [points, setPoints] = useState<point[]>([]);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(
    DEFAULT_ALGORITHM_INDEX
  );
  const [runningState, setRunningState] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(false);
  const [screenDimensions, setScreenDimensions] =
    useState<dimensions>(DEFAULT_DIMENSIONS);
  const [antColonyOptions, setAntColonyOptions] = useState<AntColonyOptions>(
    DEFAULT_ANT_COLONY_OPTIONS
  );

  const isMobile = useMemo(() => window.innerWidth < MOBILE_BREAKPOINT, []);
  const margins = useMemo(
    () => (showPoints ? MARGINS_WITH_POINTS : DEFAULT_MARGINS),
    [showPoints]
  );

  const { addPoints, createAddPointClick } = usePointsFunctions(
    setPoints,
    screenDimensions,
    margins
  );

  const resetStats = useResetStats({
    setStats,
    currentAlgorithm,
    antColonyOptions,
    points,
  });

  const {
    handleAlgorithmSetup,
    handleRunAlgorithm,
    handleSetupReRunAlgorithm,
    handleReRunAlgorithm,
  } = useRunFunctions(
    points,
    setErrorMessage,
    currentAlgorithm,
    setCurrentAlgorithm,
    setLoading,
    setMenuOpen,
    isMobile,
    setPoints,
    canvas,
    ctx,
    showPoints,
    running,
    setRunningState,
    resetStats,
    antColonyOptions,
    speed,
    theme,
    showExtraLines,
    setStats,
    stats,
    setHistory,
    history
  );

  const updateScreenDimensions = useCallback(
    debounce(() => {
      setScreenDimensions({
        width: screen?.current?.offsetWidth,
        height: screen?.current?.offsetHeight,
      });
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    }, 100),
    [screen]
  );

  const toggleMenu = () => {
    isMobile && setMenuOpen((menuOpen) => !menuOpen);
  };

  useEffect(() => {
    updateScreenDimensions();

    window.addEventListener("resize", () => {
      updateScreenDimensions();
    });

    if (canvas.current != null) {
      setCtx(getCanvas());
    }
  }, []);

  useEffect(() => {
    const addPointClick = createAddPointClick(
      modalOpen,
      margins,
      menuOpen,
      toggleMenu
    );

    window.addEventListener("click", addPointClick, true);
    return () => window.removeEventListener("click", addPointClick, true);
  }, [modalOpen, margins, toggleMenu]);

  useEffect(() => {
    setProperty("--primary", theme.colour);
    showMap
      ? setProperty("--map", theme.image)
      : setProperty("--map", GRID_BACKGROUND);
  }, [theme, showMap]);

  useEffect(() => {
    clearCanvas(canvas.current!, ctx!);

    plotPoints(points, ctx!, !showPoints);

    setTimeout(() => {
      plotPoints(points, ctx!, !showPoints);
    }, 50);

    resetStats();
  }, [screenDimensions, points, showPoints]);

  useEffect(() => {
    if (runningState) {
      setTimeout(() => {
        handleRunAlgorithm();
      }, 100);
    }
  }, [runningState]);

  useEffect(() => {
    resetStats();
  }, [antColonyOptions, currentAlgorithm]);

  return (
    <div className="container">
      <div className="background-overlay"></div>

      <ErrorMessage message={errorMessage} setMessage={setErrorMessage} />

      <Tutorial open={modalOpen} setOpen={setModalOpen} theme={theme} />

      <LoadingText
        text="calculating"
        dots={true}
        state={loading}
        setState={setLoading}
      />

      <div className="header">
        <div className="mobile-selector">
          <AlgorithmSelector
            algorithms={algorithms}
            currentAlgorithm={currentAlgorithm}
            setCurrentAlgorithm={setCurrentAlgorithm}
          />

          <Selector
            title="POINTS"
            show={!isMobile}
            options={POINT_OPTIONS}
            value={points.length}
            setOption={(value) =>
              value == 0 ? setPoints([]) : addPoints(value)
            }
            clear={true}
            id="points"
          />

          <RunButton
            running={running}
            setRunningState={setRunningState}
            handleAlgorithmSetup={handleAlgorithmSetup}
          />
        </div>

        {/* Toggle For Dropdown Menu on Mobile */}
        <div
          className={`mobile-dropdown ${menuOpen ? "open" : ""}`}
          onClick={() => toggleMenu()}
        >
          Options{" "}
          {menuOpen ? <FaAngleUp></FaAngleUp> : <FaAngleDown></FaAngleDown>}
        </div>

        <div className={`mobile-options ${menuOpen ? "open" : ""}`}>
          <Selector
            title="SPEED"
            show={
              algorithms[currentAlgorithm].name !== "Ant Colony Optimization"
            }
            options={SPEED_OPTIONS}
            value={speed}
            setOption={setSpeed}
          />

          <Selector
            title="TIME COMPLEXITY"
            value={speed}
            show={algorithms[currentAlgorithm].timeComplexity != "null"}
            setOption={setSpeed}
            customContent={
              <div
                className="optionContent"
                style={{ margin: 0, alignItems: "flex-start" }}
              >
                <BlockMath>
                  {algorithms[currentAlgorithm].timeComplexity}
                </BlockMath>
              </div>
            }
            options={[]}
            id="time-complexity"
          />

          <Selector
            title="ANTS"
            show={
              algorithms[currentAlgorithm].name == "Ant Colony Optimization"
            }
            options={ANT_OPTIONS}
            value={antColonyOptions.numAnts}
            setOption={(value) =>
              setAntColonyOptions({
                ...antColonyOptions,
                numAnts: value,
              })
            }
          />

          <Selector
            title="ITERATIONS"
            show={
              algorithms[currentAlgorithm].name == "Ant Colony Optimization"
            }
            options={ITERATION_OPTIONS}
            value={antColonyOptions.numIterations}
            setOption={(value) =>
              setAntColonyOptions({
                ...antColonyOptions,
                numIterations: value,
              })
            }
            id="iterations"
          />

          <OptionsSelector
            showExtraLines={showExtraLines}
            setShowExtraLines={setShowExtraLines}
            showMap={showMap}
            setShowMap={setShowMap}
            showPoints={showPoints}
            setShowPoints={setShowPoints}
          />

          <ThemeSelector
            themes={themes}
            theme={theme}
            setTheme={setTheme}
            showMap={showMap}
          />
        </div>
      </div>

      <div className="adaptable-row">
        <StatsRow stats={stats} theme={theme} points={points} />

        <div className="flex-seperator-horizontal"></div>
        <div className="flex-seperator-horizontal"></div>

        <HistoryRow
          history={history}
          algorithms={algorithms}
          handleSetupReRunAlgorithm={handleSetupReRunAlgorithm}
          handleReRunAlgorithm={handleReRunAlgorithm}
          setHistory={setHistory}
          theme={theme}
          running={running}
        />
      </div>

      {/* Help Button to Open Tutorial */}
      {!modalOpen && (
        <button className="helpButton" onClick={() => setModalOpen(true)}>
          Tutorial <RxOpenInNewWindow />
        </button>
      )}

      <RunButton
        running={running}
        setRunningState={setRunningState}
        handleAlgorithmSetup={handleAlgorithmSetup}
        bottom={true}
      />

      {/* Canvas Container */}
      <div className="screen" ref={screen}>
        <canvas
          className="canvas"
          id="canvas"
          width={screenDimensions.width || 150}
          height={screenDimensions.height || 150}
          ref={canvas}
        ></canvas>
      </div>
    </div>
  );
};

export default App;
