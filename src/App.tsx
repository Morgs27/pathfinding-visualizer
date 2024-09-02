import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

/// --- Local Imports --- ///
import "./App.css";
import { getCanvas, plotPoints, clearCanvas } from "./functions/draw/draw";
import { TutorialModal, Page } from "./components/TutorialModal";
import { LoadingText } from "./components/LoadingText";
import ErrorMessage from "./components/ErrorMessage";
import dimensions from "./types/Dimensions";
import point from "./types/Point";
import algorithms from "./config/Algorithms";
import themes, { Theme } from "./config/Themes";
import { debounce, setProperty } from "./functions/helpers";
import { Stat } from "./config/Stats";
import Record from "./types/Record";
import AntColonyOptions from "./types/AntColonyOptions";
import config from "./config/config";
import { usePointsFunctions } from "./hooks/usePoints";
import useRunFunctions from "./hooks/useRunFunctions";
import useResetStats from "./hooks/useResetStats";

/// --- Icons --- ///
import { LuMapPinOff, LuMapPin } from "react-icons/lu";
import { LiaChartLineSolid } from "react-icons/lia";
import { MdClear } from "react-icons/md";
import { FaAngleDown, FaAngleUp, FaPlay, FaRedo } from "react-icons/fa";
import { BsFillStopCircleFill } from "react-icons/bs";
import { RxOpenInNewWindow } from "react-icons/rx";
import { TbMap, TbMapOff } from "react-icons/tb";

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
} = config;

function App() {
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
    const addPointClick = createAddPointClick(modalOpen, margins, toggleMenu);
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

      {/* Error Message Component */}
      <ErrorMessage message={errorMessage} setMessage={setErrorMessage} />

      {/* Tutorial Modal Component which shows on page load */}
      <TutorialModal state={modalOpen} setState={setModalOpen}>
        <Page>
          <h3>Welcome to TSP Visualizer</h3>
          <p>
            <i>TSP - Traveling Salesman Problem</i>
          </p>
          <img
            className="fadeIn"
            height={150}
            src={theme.locationDot}
            alt={theme.name}
            style={{ animation: "fadeIn 1s ease-in-out", height: 150 }}
          />
          <p>
            This short tutorial will walk you through all the features of this
            application.
          </p>
        </Page>
        <Page>b content</Page>
        <Page>c content</Page>
      </TutorialModal>

      <LoadingText
        text="calculating"
        dots={true}
        state={loading}
        setState={setLoading}
      />

      <div className="header">
        <div className="mobile-selector">
          {/* Algorithm Selector Dropdown */}
          <div className="option algorithm-option">
            <div className="optionTitle">ALGORITHM</div>
            <div className="optionContent">
              <Dropdown
                options={algorithms.map((algo) => algo.name)}
                onChange={(e) => {
                  setCurrentAlgorithm(
                    algorithms.findIndex((algo) => algo.name === e.value)
                  );
                }}
                value={algorithms[currentAlgorithm].name}
                placeholder="Select an algorithm"
              />
            </div>
          </div>

          {/* Add Points Buttons */}
          <div className="option points-option">
            <div className="optionTitle">POINTS</div>
            <div className="optionContent">
              <div className="buttonGroup">
                {POINT_OPTIONS.map((points) => (
                  <button
                    data-active={true}
                    key={points}
                    onClick={() => addPoints(points)}
                  >
                    {points} +
                  </button>
                ))}
                <button
                  onClick={() => {
                    setPoints([]);
                    toggleMenu();
                    clearCanvas(canvas.current!, ctx!);
                  }}
                  style={{
                    borderColor: "rgba(255,255,255,0.6)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="option run-option">
            <div className="optionTitle">RUN</div>
            <div className="optionContent">
              <div className="buttonGroup">
                <button
                  onClick={() => handleAlgorithmSetup()}
                  disabled={running.current}
                  className={`${running.current ? "disabled" : ""}`}
                >
                  Run <FaPlay className="icon"></FaPlay>
                </button>
                <button
                  onClick={() => {
                    running.current = false;
                    setRunningState(false);
                  }}
                  disabled={!running.current}
                  className={`${!running.current ? "disabled" : ""}`}
                >
                  Stop{" "}
                  <BsFillStopCircleFill className="icon"></BsFillStopCircleFill>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mobile-dropdown ${menuOpen ? "open" : ""}`}
          onClick={() => toggleMenu()}
        >
          Settings{" "}
          {menuOpen ? <FaAngleUp></FaAngleUp> : <FaAngleDown></FaAngleDown>}
        </div>

        <div className={`mobile-options ${menuOpen ? "open" : ""}`}>
          {/* Speed Buttons */}
          {algorithms[currentAlgorithm].name !== "Ant Colony Optimization" && (
            <div className="option">
              <div className="optionTitle">SPEED</div>
              <div className="optionContent">
                <div className="buttonGroup">
                  {SPEED_OPTIONS.map((value) => (
                    <button
                      key={value.value}
                      data-active={speed === value.value ? "true" : "false"}
                      onClick={() => setSpeed(value.value)}
                    >
                      {value.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Algorithm Time Complexity */}
          {algorithms[currentAlgorithm].timeComplexity != "null" && (
            <div className="option">
              <div className="optionTitle">TIME COMPLEXITY</div>
              <div
                className="optionContent"
                style={{ margin: 0, alignItems: "flex-start" }}
              >
                <BlockMath>
                  {algorithms[currentAlgorithm].timeComplexity}
                </BlockMath>
              </div>
            </div>
          )}

          {algorithms[currentAlgorithm].name === "Ant Colony Optimization" && (
            <>
              {/* Number of Ants Selector */}
              <div className="option">
                <div className="optionTitle">ANTS</div>
                <div className="optionContent">
                  <div className="buttonGroup">
                    {ANT_OPTIONS.map((value) => (
                      <button
                        key={value}
                        data-active={
                          antColonyOptions.numAnts === value ? "false" : "true"
                        }
                        onClick={() =>
                          setAntColonyOptions((antColonyOptions) => ({
                            ...antColonyOptions,
                            numAnts: antColonyOptions.numAnts + value,
                          }))
                        }
                      >
                        {value} +
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setAntColonyOptions({
                          ...antColonyOptions,
                          numAnts: 0,
                        });
                      }}
                      style={{
                        borderColor: "rgba(255,255,255,0.6)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Iterations Selector */}
              <div className="option">
                <div className="optionTitle">ITERATIONS</div>
                <div className="optionContent">
                  <div className="buttonGroup">
                    {ITERATION_OPTIONS.map((value) => (
                      <button
                        key={value}
                        data-active={
                          antColonyOptions.numIterations === value
                            ? "true"
                            : "false"
                        }
                        onClick={() =>
                          setAntColonyOptions({
                            ...antColonyOptions,
                            numIterations: value,
                          })
                        }
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Add Points Buttons */}
          <div className="option points-settings">
            <div className="optionTitle">OPTIONS</div>
            <div className="optionContent">
              <div className="buttonGroup settings">
                <button
                  onClick={() => setShowExtraLines(!showExtraLines)}
                  data-active={showExtraLines ? "true" : "false"}
                >
                  {showExtraLines ? (
                    <LiaChartLineSolid />
                  ) : (
                    <LiaChartLineSolid />
                  )}
                </button>
                <button
                  onClick={() => setShowMap(!showMap)}
                  data-active={showMap ? "true" : "false"}
                >
                  {showMap ? <TbMap /> : <TbMapOff />}
                </button>
                <button
                  onClick={() => setShowPoints(!showPoints)}
                  data-active={showPoints ? "true" : "false"}
                >
                  {showPoints ? <LuMapPin /> : <LuMapPinOff />}
                </button>
              </div>
            </div>
          </div>

          <div className="option">
            <div className="optionTitle">THEME</div>
            <div className="optionContent">
              <div className="buttonGroup themes">
                {themes.map((themeOption, index) => (
                  <button
                    key={index}
                    data-active={theme === themeOption ? "true" : "false"}
                    onClick={() => setTheme(themeOption)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = themeOption.colour)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.6)")
                    }
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {showMap ? (
                      <img
                        src={themeOption.imagePlainUrl}
                        alt={themeOption.name}
                        className="fadeIn"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          opacity: 0.2,
                          backgroundColor: themeOption.colour,
                        }}
                      ></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="adaptable-row">
        {/* Stats Bar */}
        <div className="stats">
          {/* Number of points */}
          <div className="stat">
            <div className="icon">
              <img src={theme.locationDot} alt="point" className="point-icon" />
            </div>
            {" " + points.length}
          </div>

          {/* Show different stats based off of the current algorithm */}
          {stats.map((stat, index) => {
            if (stat.value !== null && stat.value !== 0) {
              return (
                <div key={index} className="stat fadeIn">
                  <div className="icon">{stat.icon}</div>
                  {stat.showName && `${stat.name}: `}
                  {`${stat.value} ${stat.unit || ""}`}
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="flex-seperator-horizontal"></div>
        <div className="flex-seperator-horizontal"></div>

        {history.length > 0 && (
          <div className="history-buttons">
            {history.map((record, index) => (
              <button
                key={index}
                onClick={() => {
                  handleSetupReRunAlgorithm(record);
                }}
              >
                <div className="algorithm-name">
                  {algorithms[record.algorithmIndex].name}
                </div>
                <div className="row">
                  <div className="distance">{record.distance} px</div>
                  <div className="points">
                    {record.points.length}
                    <img
                      src={theme.locationDot}
                      alt="point"
                      className="point-icon"
                    />
                  </div>
                </div>
                {running.current == false && (
                  <div
                    className="run"
                    onClick={() => handleReRunAlgorithm(record)}
                  >
                    Re-run <FaRedo className="icon"></FaRedo>
                  </div>
                )}
              </button>
            ))}
            <button className="clear-history" onClick={() => setHistory([])}>
              Clear
              <MdClear />
            </button>
          </div>
        )}
      </div>

      {/* Help Button to Open Tutorial */}
      {!modalOpen && (
        <button className="helpButton" onClick={() => setModalOpen(true)}>
          Tutorial <RxOpenInNewWindow />
        </button>
      )}

      <div className="bottom-run">
        <button
          onClick={() => handleAlgorithmSetup()}
          disabled={running.current}
          className={`${running.current ? "disabled" : ""}`}
        >
          Run <FaPlay className="icon"></FaPlay>
        </button>
        <button
          onClick={() => {
            running.current = false;
            setRunningState(false);
          }}
          disabled={!running.current}
          className={`${!running.current ? "disabled" : ""}`}
        >
          Stop <BsFillStopCircleFill className="icon"></BsFillStopCircleFill>
        </button>
      </div>

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
}

export default App;
