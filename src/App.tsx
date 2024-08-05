import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";

// Import Dropdown Component
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import { LuMapPinOff, LuMapPin } from "react-icons/lu";
import { LiaChartLineSolid } from "react-icons/lia";

import { IoMdColorPalette } from "react-icons/io";
import {
  MdClear,
  MdDeleteForever,
  MdDeleteOutline,
  MdMultilineChart,
} from "react-icons/md";

// Import App Styles
import "./App.css";

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

// Import Icons
import { FaAngleDown, FaAngleUp, FaPlay } from "react-icons/fa";
import { BsFillStopCircleFill, BsQuestionLg } from "react-icons/bs";
import { FaRedo } from "react-icons/fa";

// Import canvas drawing functions
import {
  getCanvas,
  plotPoints,
  clearCanvas,
} from "./functions/basicDrawFunctions";

// Import Equation visualizer
// import { Equation } from "react-equation";

// Import Components
import { TutorialModal, Page } from "./components/TutorialModal";
import { LoadingText } from "./components/LoadingText";
import ErrorMessage from "./components/ErrorMessage";

import dimensions from "./types/Dimensions";
import point from "./types/Point";

import algorithms from "./config/Algorithms";

import themes, { Theme } from "./config/Themes";

import {
  factorialize,
  debounce,
  distance,
  generateEdges,
} from "./functions/helpers";
import convexHullAlgorithm from "./algorithms/ConvexHullAlgorithm";
import VisualiseAlgorithm from "./functions/runAlgorithm";
import { defaultStats, Stat } from "./config/Stats";
import Record from "./types/Record";
import { RxOpenInNewWindow } from "react-icons/rx";
import AntColonyOptions from "./types/AntColonyOptions";
import { TbMap, TbMapOff } from "react-icons/tb";

function App() {
  // Refrences to container elements
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const screen = useRef<HTMLDivElement | null>(null);
  var ctx: null | CanvasRenderingContext2D = null;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(themes[2]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [history, setHistory] = useState<Record[]>([]);
  const [showPoints, setShowPoints] = useState(false);
  const [showExtraLines, setShowExtraLines] = useState(false);
  const [points, setPoints] = useState<point[]>([]);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
  const [runningState, setRunningState] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(10);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [screenDimensions, setScreenDimensions] = useState<dimensions>({
    width: 150,
    height: 150,
  });

  const running = useRef<boolean>(false);
  const isMobile = window.innerWidth < 800;
  var addingPoint: boolean = false;

  // Margins for adding points
  const margins = showPoints
    ? {
        top: 40,
        bottom: 10,
        left: 15,
        right: 15,
      }
    : {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      };

  const pointOptions = [5, 10];
  const antOptions = [1, 5];
  const iterationOptions = [1, 3, 10];
  const speedOptions = [
    { name: "1", value: 100 },
    { name: "10", value: 10 },
    { name: "100", value: 1 },
  ];

  const [antColonyOptions, setAntColonyOptions] = useState<AntColonyOptions>({
    alpha: 1, // pheromone importance
    beta: 5, // distance priority
    evaporationRate: 0.5, // pheromone evaporation rate
    Q: 100, // pheromone deposit factor
    numAnts: 5, // number of ants
    numIterations: 1, // number of iterations
  });

  const grid =
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 2px, transparent 2px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 2px, transparent 2px, transparent 40px)";

  /// --- General Functions --- ///

  const sortScreenDimensions = useCallback(
    debounce(() => {
      // Set screen dimensions
      setScreenDimensions({
        width: screen?.current?.offsetWidth,
        height: screen?.current?.offsetHeight,
      });

      // set --vh in styles to be equal to 1% of the viewport height
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    }, 100),
    [screen]
  );

  // Startup Function
  useEffect(() => {
    sortScreenDimensions();

    window.addEventListener("resize", () => {
      sortScreenDimensions();
    });

    if (canvas.current != null) {
      ctx = getCanvas();
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", theme.colour);
    if (showMap) {
      document.documentElement.style.setProperty("--map", theme.image);
    } else {
      document.documentElement.style.setProperty("--map", grid);
    }
  }, [theme, showMap]);

  function toggleMenu() {
    isMobile && setMenuOpen((menuOpen) => !menuOpen);
  }

  /// --- Points Functions --- ///

  // Add singular point at position (x,y) to screen
  function addPoint(x: number, y: number) {
    setPoints((points) => {
      return [
        ...points.map((point) => {
          return { ...point, solved: false };
        }),
        { x: x, y: y, solved: false },
      ];
    });
    // checkDuplicatePoints();
  }

  // Initiate addPointClick function to be rewritten bellow
  let addPointClick = (e: any) => {};

  useEffect(() => {
    if (modalOpen == false) {
      addPointClick = (e: any) => {
        // If header or button is target ignore
        if (
          !(e.target as Element).closest(".header") &&
          !(e.target as Element).closest(".button") &&
          !(e.target as Element).closest(".pageCover") &&
          !(e.target as Element).closest(".tutorialModal") &&
          !(e.target as Element).closest(".stats")
        ) {
          // Ensures that points are not spammed
          if (addingPoint == false) {
            addingPoint = true;

            // Check the point is not too close to the top of the screen
            if (e.offsetY > margins.top) {
              addPoint(e.offsetX, e.offsetY);
            }

            toggleMenu();

            setTimeout(() => {
              addingPoint = false;
            }, 300);
          }
        }
      };
    } else {
      addPointClick = (e: any) => {
        // Do nothing
      };
    }

    window.addEventListener(
      "click",
      (e: any) => {
        addPointClick(e);
      },
      true
    );
  }, [modalOpen]);

  // Add any number of points randomly to screen
  function addPoints(number: number) {
    toggleMenu();
    setPoints((points) => [
      ...points,
      ...Array(number)
        .fill(undefined)
        .map(() => {
          return {
            x:
              Math.random() *
                ((screenDimensions.width || 0) - margins.left - margins.right) +
              margins.left,
            y:
              Math.random() *
                ((screenDimensions.height || 0) -
                  margins.top -
                  margins.bottom) +
              margins.top,
            solved: false,
          };
        }),
    ]);
    checkDuplicatePoints();
  }

  // Check for duplicate points
  function checkDuplicatePoints() {
    setPoints((points) => {
      return [...new Map(points.map((point) => [point.x, point])).values()];
    });
  }

  function resetStats() {
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
  }

  // Plot Points on first render and when points changes
  useEffect(() => {
    clearCanvas(canvas.current!, ctx!);

    plotPoints(points, ctx!, !showPoints);

    setTimeout(() => {
      plotPoints(points, ctx!, !showPoints);
    }, 50);

    resetStats();
  }, [screenDimensions, points, showPoints]);

  // Run Algorithm on runningState change
  useEffect(() => {
    if (runningState) {
      setTimeout(() => {
        runAlgorithm();
      }, 100);
    }
  }, [runningState]);

  useEffect(() => {
    resetStats();
  }, [antColonyOptions]);

  useEffect(() => {
    resetStats();
  }, [currentAlgorithm]);

  // Function to run before any algorithm
  function algorithmSetup() {
    if (currentAlgorithm == 5) {
      if (points.length > 11) {
        setErrorMessage(
          "Due to performance issues the Brute Force algorithm is limited to 10 points"
        );
        return;
      }
    }

    if (points.length == 0) {
      setErrorMessage("Please add some points to the screen");
      return;
    }

    setLoading(true);

    setMenuOpen(() => !isMobile);

    // Clear Canvas
    setPoints((points) =>
      points.map((points) => {
        return { ...points, solved: false };
      })
    );
    clearCanvas(canvas.current!, ctx!);
    plotPoints(points, ctx!, !showPoints);

    // Setup Running
    running.current = true;
    setRunningState(true);

    // Reset Stats
    resetStats();
  }

  const runAlgorithm = async () => {
    const options = currentAlgorithm == 0 ? antColonyOptions : {};

    // Calculate + Build Frames
    const frames = await algorithms[currentAlgorithm].calculateFunction!(
      [...points],
      options
    );

    setLoading(false);

    // Visualise Frames with Animation
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

  // Function to run when any algorithm is finished
  function algorithmFinished() {
    running.current = false;
    setRunningState(false);
  }

  function setupReRunAlgorithm(record: Record) {
    setCurrentAlgorithm(record.algorithmIndex);
    running.current = true;
    reRunAlgorithm(record);
    resetStats();
    setMenuOpen(() => !isMobile);
    setPoints(record.points);
    setTimeout(() => {
      if (running.current == false) {
        reRunAlgorithm(record);
      }
    }, 400);
  }

  function reRunAlgorithm(record: Record) {
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
  }

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

      {/* Loading Text Component */}
      <LoadingText state={loading} setState={setLoading} />

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
                {pointOptions.map((points) => (
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
                  onClick={() => algorithmSetup()}
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
                  {speedOptions.map((value) => (
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
                    {antOptions.map((value) => (
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
                    {iterationOptions.map((value) => (
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
                  setupReRunAlgorithm(record);
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
                  <div className="run" onClick={() => reRunAlgorithm(record)}>
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
          onClick={() => algorithmSetup()}
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
