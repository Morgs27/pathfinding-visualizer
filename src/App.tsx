import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";

// Import Dropdown Component
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

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
import convexHullAlgorithm from "./algorithms/ConvexHull/ConvexHullAlgorithm";
import VisualiseAlgorithm from "./functions/runAlgorithm";
import { defaultStats, Stat } from "./config/Stats";
import Record from "./types/Record";
import { RxOpenInNewWindow } from "react-icons/rx";
import AntColonyOptions from "./types/AntColonyOptions";

function App() {
  // Refrences to container elements
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const screen = useRef<HTMLDivElement | null>(null);
  var ctx: null | CanvasRenderingContext2D = null;

  // Error State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Theme State
  const [theme, setTheme] = useState<Theme>(themes[0]);

  // Menu State
  const [menuOpen, setMenuOpen] = useState<boolean>(true);

  // Tutorial Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(true);

  // Screen Dimensions
  const [screenDimensions, setScreenDimensions] = useState<dimensions>({
    width: 150,
    height: 150,
  });

  // Check if device is mobile
  const isMobile = window.innerWidth < 800;

  // Offset from top of screen for adding points
  const margins = {
    top: 60,
    bottom: 70,
    left: 10,
    right: 10,
  };

  const speedOptions = [1, 10, 100];

  const pointOptions = [5, 10];

  const [antColonyOptions, setAntColonyOptions] = useState<AntColonyOptions>({
    alpha: 1, // pheromone importance
    beta: 5, // distance priority
    evaporationRate: 0.5, // pheromone evaporation rate
    Q: 100, // pheromone deposit factor
    numAnts: 3, // number of ants
    numIterations: 3, // number of iterations
  });

  // Save Algorithm Run History
  const [history, setHistory] = useState<Record[]>([]);

  const [showPoints, setShowPoints] = useState(true);

  const [showExtraLines, setShowExtraLines] = useState(true);

  // Points
  const [points, setPoints] = useState<point[]>([]);
  var addingPoint: Boolean = false;

  // Current Algorithm
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);

  // Algorithm Running State
  const running = useRef<Boolean>(false);
  const [runningState, setRunningState] = useState<Boolean>(false);

  // Speed
  const [speed, setSpeed] = useState<number>(10);

  // Stats for each algorithm
  const [stats, setStats] = useState<Stat[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
    console.log("History", history);
  }, [history]);

  useEffect(() => {
    // change the root styles
    document.documentElement.style.setProperty("--map", theme.image);
    document.documentElement.style.setProperty("--primary", theme.colour);
  }, [theme]);

  // Startup Function - Only runs on first render
  useEffect(() => {
    sortScreenDimensions();

    window.addEventListener("resize", () => {
      sortScreenDimensions();
    });

    if (canvas.current != null) {
      ctx = getCanvas();
    }
  }, []);

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
    checkDuplicatePoints();
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
            statID == "ants" ? antColonyOptions.numAnts : points.length;
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

    plotPoints(points, ctx!);

    setTimeout(() => {
      plotPoints(points, ctx!);
    }, 50);

    resetStats();
  }, [screenDimensions, points]);

  // Reset Points on algorithm change
  // useEffect(() => {
  //   resetStats();
  //   algorithmFinished();
  // }, [currentAlgorithm]);

  // Run Algorithm on runningState change
  useEffect(() => {
    if (runningState) {
      setTimeout(() => {
        runAlgorithm();
      }, 100);
    }
  }, [runningState]);

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
    plotPoints(points, ctx!);

    // Setup Running
    running.current = true;
    setRunningState(true);

    // Reset Stats
    resetStats();
  }

  const runAlgorithm = async () => {
    const options =
      currentAlgorithm == 0
        ? antColonyOptions
        : {};

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
    });
  }

  return (
    <div className="container">
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

      <div className="header" data-menu={menuOpen ? "open" : "close"}>
        {/* Algorithm Selector Dropdown */}
        <div className="option">
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
        <div className="option">
          <div className="optionTitle">ADD POINTS</div>
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

        {/* Speed Buttons */}
        <div className="option">
          <div className="optionTitle">TIME DELAY</div>
          <div className="optionContent">
            <div className="buttonGroup">
              {speedOptions.map((value) => (
                <button
                  key={value}
                  data-active={speed === value ? "true" : "false"}
                  onClick={() => setSpeed(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithm Time Complexity */}
        {algorithms[currentAlgorithm].timeComplexity != "null" && (
          <div className="option">
            <div className="optionTitle">TIME COMPLEXITY</div>
            <div className="optionContent">
              <BlockMath>
                {algorithms[currentAlgorithm].timeComplexity}
              </BlockMath>
            </div>
          </div>
        )}

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
                  <img src={themeOption.imagePlainUrl} alt={themeOption.name} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="option">
          <div className="optionTitle">SETTINGS</div>
          <div className="optionContent">
            <div className="buttonGroup settings">
              <button
                data-active={!showExtraLines ? "true" : "false"}
                onClick={() =>
                  setShowExtraLines((showExtraLines) => !showExtraLines)
                }
              >
                <MdMultilineChart />
              </button>
            </div>
          </div>
        </div>

        {/* Run Button */}
        {!isMobile && (
          <div
            className="option"
            style={{ placeItems: "center", gridTemplateRows: "1fr" }}
          >
            {runningState ? (
              <button
                style={{
                  backgroundColor: "transparent",
                  color: "var(--primary)",
                }}
                className="run"
                onClick={() => {
                  running.current = false;
                  setRunningState(false);
                }}
              >
                Stop{" "}
                <BsFillStopCircleFill className="icon"></BsFillStopCircleFill>
              </button>
            ) : (
              <button className="run" onClick={() => algorithmSetup()}>
                Run <FaPlay className="icon"></FaPlay>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Header Close Button */}
      <div className="headerClose" onClick={() => toggleMenu()}>
        {menuOpen ? <FaAngleUp></FaAngleUp> : <FaAngleDown></FaAngleDown>}
      </div>

      {/* Stats Bar */}
      <div className="stats">
        {/* Number of points */}
        <div className="stat">{"Points: " + points.length}</div>

        {/* Show different stats based off of the current algorithm */}
        {stats.map((stat, index) => {
          if (stat.value !== null) {
            return (
              <div key={index} className="stat">
                {`${stat.name}: ${stat.value} ${stat.unit || ""}`}
              </div>
            );
          }
          return null;
        })}

        {isMobile && (
          <>
            <div className="flex-seperator"></div>

            {runningState ? (
              <button
                style={{
                  backgroundColor: "transparent",
                  color: "var(--primary)",
                }}
                className="run"
                onClick={() => {
                  running.current = false;
                  setRunningState(false);
                }}
              >
                Stop{" "}
                <BsFillStopCircleFill className="icon"></BsFillStopCircleFill>
              </button>
            ) : (
              <button className="run mobile" onClick={() => algorithmSetup()}>
                Run <FaPlay className="icon"></FaPlay>
              </button>
            )}
          </>
        )}
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

      {!isMobile && (
        <div className="history-buttons">
          {history.length > 0 && (
            <button className="clear-history" onClick={() => setHistory([])}>
              Clear
              <MdClear />
            </button>
          )}
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

          <div className="flex-seperator-horizontal"></div>

          {/* Help Button to Open Tutorial */}
          {!modalOpen && (
            <button className="helpButton" onClick={() => setModalOpen(true)}>
              Tutorial <RxOpenInNewWindow />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
