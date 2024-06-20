import { LegacyRef, useEffect, useRef, useState } from "react";

// Import Dropdown Component
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

// Import App Styles
import "./App.css";

// Import Icons
import { FaAngleDown, FaAngleUp, FaPlay } from "react-icons/fa";
import { BsFillStopCircleFill } from "react-icons/bs";

// Import Algorithms
import { greedyAlgorithm } from "./algorithms/GreedyAlgorithm";
import { bruteForceAlgorithm } from "./algorithms/BruteForceAlgorithm";
import { nearestNeighborAlgorithm } from "./algorithms/NearestNeighborAlgorithm";

// Import canvas drawing functions
import {
  getCanvas,
  plotPoints,
  clearCanvas,
  plotPath,
  plotLine,
} from "./DrawFunctions";

// Import Equation visualizer
import { Equation } from "react-equation";

// Import Components
import { TutorialModal, Page } from "./components/TutorialModal";
import { LoadingText } from "./components/LoadingText";

import { edge } from "./algorithms/GreedyAlgorithm";
import ErrorMessage from "./components/ErrorMessage";

type dimensions = {
  width: number | undefined;
  height: number | undefined;
};

export type point = {
  x: number;
  y: number;
  solved?: boolean;
};

function App() {
  // Refrences to container elements
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const screen = useRef<HTMLDivElement | null>(null);
  var ctx: null | CanvasRenderingContext2D = null;

  // Error State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Menu State
  const [menuOpen, setMenuOpen] = useState<boolean>(true);

  // Tutorial Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(true);

  // Screen Dimensions
  const [screenDimensions, setScreenDimensions] = useState<dimensions>({
    width: 150,
    height: 150,
  });

  // Offset from top of screen for adding points
  const offsetTop = 60;

  // Points
  const [points, setPoints] = useState<point[]>([]);
  var addingPoint: Boolean = false;

  // Algorithm Information in Parallel Arrays
  const algorithmNames = [
    "Ant Colony Optimization",
    "Nearest Neighbour",
    "Greedy",
    "Nearest Insertion",
    "Convex Hull Insertion",
    "Brute Force",
  ];
  const algorithmFunctions = [
    runAntColonyAlgorithm,
    runNearestNeighborAlgorithm,
    runGreedyAlgorithm,
    runNearestInsertionAlgorithm,
    runConvexHullAlgorithm,
    runBruteForceAlgorithm,
  ];
  const algorithmCalculateFunctions = [
    null,
    nearestNeighborAlgorithm,
    greedyAlgorithm,
    null,
    null,
    bruteForceAlgorithm,
  ];
  const algorithmTimeComplexities = [
    "null",
    "O(n^2)",
    "O(n^2log_2(n))",
    "O(n^2)",
    "O(n^2log_2(n))",
    "O(n!)",
  ];
  const algorithmAccuracy = ["null", "75%", "80-85%", "null", "null", "100%"];

  // Current Algorithm
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);

  // Algorithm Running State
  const running = useRef<Boolean>(false);
  const [runningState, setRunningState] = useState<Boolean>(false);

  // Speed
  const [speed, setSpeed] = useState<number>(10);

  // Stats for each algorithm
  const [currentPermutation, setCurrentPermutation] = useState(0);
  const [totalPermutations, setTotalPermutations] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [completedEdges, setCompletedEdges] = useState(0);

  // Loading State
  const [loading, setLoading] = useState(false);

  /// --- General Functions --- ///

  // Startup Function - Only runs on first render
  useEffect(() => {
    setScreenDimensions({
      width: screen?.current?.offsetWidth,
      height: screen?.current?.offsetHeight,
    });

    window.addEventListener("resize", () => {
      setScreenDimensions({
        width: screen?.current?.offsetWidth,
        height: screen?.current?.offsetHeight,
      });
    });

    if (canvas.current != null) {
      ctx = getCanvas();
    }
  }, []);

  function toggleMenu() {
    setMenuOpen((menuOpen) => !menuOpen);
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

            console.log(e.offsetX, e.offsetY);

            // Check the point is not too close to the top of the screen
            if (e.offsetY > offsetTop) {
              addPoint(e.offsetX, e.offsetY);
            }

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
    setPoints((points) => [
      ...points,
      ...Array(number)
        .fill(undefined)
        .map(() => {
          return {
            x: Math.random() * (screenDimensions.width || 0),
            y:
              Math.random() * ((screenDimensions.width || 0) - offsetTop) +
              offsetTop,
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

  // Plot Points on first render and when points changes
  useEffect(() => {
    clearCanvas(canvas.current!, ctx!);

    plotPoints(points, ctx!);

    setTimeout(() => {
      plotPoints(points, ctx!);
    }, 50);

    // Update permutations stat
    let total = factorialize(points.length);
    setTotalPermutations(total);
  }, [screenDimensions, points]);

  // Reset Points on algorithm change
  useEffect(() => {
    algorithmFinished();
  }, [currentAlgorithm]);

  // Run Algorithm on runningState change
  useEffect(() => {
    if (runningState) {
      setTimeout(() => {
        runAlgorithm();
      }, 100);
    }
  }, [runningState]);

  /// --- Algorithm Run Functions ---- ///

  // Run/Diplay Brute Force Algorithm
  async function runBruteForceAlgorithm(result: any) {
    const [solution, permutations] = result;

    setTotalPermutations(permutations.length);

    // Add Solution to end of list
    permutations.push(solution);

    var counter = -1;

    var timeouts: any = [];

    // Loop through all permutations showing them for 10ms
    permutations.forEach((path: point[], index: number) => {
      timeouts.push(
        setTimeout(() => {
          if (index == 0) {
            // Calculation Complete
          }

          if (running.current) {
            counter += 1;
            clearCanvas(canvas.current!, ctx!);
            plotPath(path, ctx!);
            plotPoints(points, ctx!);
            setCurrentPermutation(counter);
            timeouts.shift();
          } else {
            timeouts.forEach((timeout: any) => {
              clearTimeout(timeout);
            });
            algorithmFinished();
          }

          // When the algorithm is completed displaying
          if (index == permutations.length - 1) {
            // Calculate distance between all points
            let totalDistance = 0;
            solution.forEach((point: point, index: number) => {
              if (index != 0) {
                totalDistance += distance(point, solution[index - 1]);
              }
            });

            // Set total distance
            setTotalDistance(Math.floor(totalDistance));

            algorithmFinished();
          }
        }, index * 2 * speed)
      );
    });
  }

  // Run/Diplay Nearest Neighbor Algorithm
  function runNearestNeighborAlgorithm(result: any) {
    // Run the algorithm
    const [steps, path] = result;

    // Create an idendical array to points
    const points_array: point[] = points.map((point) => {
      return { ...point, solved: false };
    });

    // Setup array to hold the points in the completed path
    var completed_path: point[] = [];

    // Setup array to hold all the timeouts/frames
    var timeouts: any[] = [];

    // Loop through all the points in the path
    path.forEach((pointIndex: number, index: number) => {
      // Create frame then add to timeouts array
      timeouts.push(
        setTimeout(() => {
          // If running
          if (running.current) {
            // Add current point to the completed path
            completed_path.push(points_array[pointIndex]);

            clearCanvas(canvas.current!, ctx!);

            // Plot the so far completed path
            plotPath(completed_path, ctx!, "orange");

            // If not on the last point
            if (index != path.length - 1) {
              // Add distance to total
              if (completed_path.length > 1) {
                setTotalDistance(
                  (prevDistance) =>
                    prevDistance +
                    Math.floor(
                      distance(completed_path.at(-1)!, completed_path.at(-2)!)
                    )
                );
              }

              var stepDistances = steps[index][0];
              var minDistance = steps[index][1];

              // Display a line for each of the options from the current point
              // with opacity proportionalized to the distance
              stepDistances.forEach(
                (distance: number | null, index: number) => {
                  if (distance != null) {
                    var lineStrength = Math.pow(
                      Math.round((1 / (distance / minDistance)) * 100) / 100,
                      4
                    );

                    var colour = "rgba(255,255,255," + lineStrength + ")";

                    plotLine(
                      points_array[pointIndex],
                      points_array[index],
                      ctx!,
                      colour
                    );
                  }
                }
              );
            }

            // Set current point to solved and update the points
            points_array[pointIndex].solved = true;
            plotPoints(points_array, ctx!);

            // Remove current frame from list of frames
            timeouts.shift();
          } else {
            // If algorithm is stopped
            // Clear all the frames that are still to run
            timeouts.forEach((timeout: any) => {
              clearTimeout(timeout);
            });
            algorithmFinished();
          }

          // If all the frames have ran end the algorithm
          if (timeouts.length == 0) {
            algorithmFinished();
          }
        }, index * 10 * speed)
      );
    });
  }

  // Run/Diplay Greedy Algorithm Algorithm
  function runGreedyAlgorithm(result: any) {
    /// Run Algorithm ///
    const [edges, allEdges] = result;

    /// Display Algorithm ///

    // Create array to hold all the frames
    var timeouts: any[] = [];

    // Loop through path edges
    edges.forEach((edge: edge, index: number) => {
      // Create frame and add to array
      timeouts.push(
        setTimeout(() => {
          // If algorithm is running
          if (running.current) {
            // Add distance of current edge to total
            setTotalDistance((distance) =>
              Math.floor(distance + edge.distance)
            );

            let currentPath = edges.filter(
              (edge: edge, filterIndex: number) => {
                return filterIndex <= index;
              }
            );

            let prevPath = edges.filter((edge: edge, filterIndex: number) => {
              return filterIndex < index;
            });

            // Loop through all possible edges between points
            // Display a line between them proportional to the distance
            allEdges.forEach((edge: edge, allEdgesIndex: number) => {
              let opacity =
                Math.pow(1 - allEdgesIndex / allEdges.length, 4) / 4;
              plotPath(
                [edge.point1, edge.point2],
                ctx!,
                "rgba(255,255,255," + opacity + ")"
              );
            });

            // Plot all the lines completed in previous frames
            prevPath.forEach((edge: edge) => {
              plotPath([edge.point1, edge.point2], ctx!);
            });

            // After a delay plot the next edge
            setTimeout(() => {
              clearCanvas(canvas.current!, ctx!);
              plotPoints(points, ctx!);

              currentPath.forEach((edge: edge) => {
                plotPath([edge.point1, edge.point2], ctx!);
              });
            }, 5 * speed);

            timeouts.shift();
          } else {
            // If algorithm is stopped
            // Clear all the frames that are still to run
            timeouts.forEach((timeout: any) => {
              clearTimeout(timeout);
            });
            algorithmFinished();
          }

          // If all the frames have ran end the algorithm
          if (timeouts.length == 0) {
            // set all the points to solved
            setPoints((points) =>
              points.map((point) => {
                return { ...point, solved: true };
              })
            );
            algorithmFinished();
          }
        }, index * 10 * speed)
      );
    });
  }

  // Run/ Display Ant Colony Algorithm
  function runAntColonyAlgorithm(result: any) {}

  function runNearestInsertionAlgorithm(result: any) {}

  function runConvexHullAlgorithm(result: any) {}

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
    setTotalDistance(0);
    setCurrentPermutation(0);
  }

  const runAlgorithm = async () => {
    // Calculate algorithm
    let result = await algorithmCalculateFunctions[currentAlgorithm]!(points);

    setLoading(false);

    // Run Function
    algorithmFunctions[currentAlgorithm](result);
  };

  // Function to run when any algorithm is finished
  function algorithmFinished() {
    running.current = false;
    setRunningState(false);
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
          <img height={150} src="./location-dot-orange.png" alt="" />
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
              options={algorithmNames}
              onChange={(e) => {
                setCurrentAlgorithm(algorithmNames.indexOf(e.value));
              }}
              value={algorithmNames[currentAlgorithm]}
              placeholder="Select an algorithm"
            />
          </div>
        </div>

        {/* Add Points Buttons */}
        <div className="option">
          <div className="optionTitle">POINTS</div>
          <div className="optionContent">
            <div className="buttonGroup">
              <button onClick={() => addPoints(1)}>1 +</button>
              <button onClick={() => addPoints(5)}>5 +</button>
              <button onClick={() => addPoints(10)}>10 +</button>
              <button
                onClick={() => {
                  setPoints([]);
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
              <button
                data-active={speed == 1 ? "true" : "false"}
                onClick={() => setSpeed(1)}
              >
                1
              </button>
              <button
                data-active={speed == 10 ? "true" : "false"}
                onClick={() => setSpeed(10)}
              >
                10
              </button>
              <button
                data-active={speed == 100 ? "true" : "false"}
                onClick={() => setSpeed(100)}
              >
                100
              </button>
            </div>
          </div>
        </div>

        {/* Algorithm Time Complexity */}
        <div className="option">
          <div className="optionTitle">TIME COMPLEXITY</div>
          <div className="optionContent">
            {currentAlgorithm == 5 ? (
              "O(n!)"
            ) : (
              <Equation
                value={algorithmTimeComplexities[currentAlgorithm]}
              ></Equation>
            )}
          </div>
        </div>

        {/* Algorithm Accuracy */}
        {algorithmAccuracy[currentAlgorithm] != "null" && (
          <div className="option">
            <div className="optionTitle">ACCURACY</div>
            <div className="optionContent">
              {algorithmAccuracy[currentAlgorithm]}
              <div className="infoButton" style={{ position: "relative" }}>
                ?
                <div className="infoContent">
                  <h3>The Held-Karp Lower Bound</h3>
                  <p>
                    A common way of measuring the performance of TSP heuristics
                    is to compare its results to the HeldKarp (HK) lower bound.
                    This lower bound is actually the solution to the linear
                    programming relaxation of the integer programming
                    formulation of the TSP.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Run Button */}
        <div
          className="option"
          style={{ placeItems: "center", gridTemplateRows: "1fr" }}
        >
          {runningState ? (
            <button
              style={{ backgroundColor: "transparent", color: "orange" }}
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
      </div>

      {/* Header Close Button */}
      <div className="headerClose" onClick={() => toggleMenu()}>
        {menuOpen ? <FaAngleUp></FaAngleUp> : <FaAngleDown></FaAngleDown>}
      </div>

      {/* Stats Bar */}
      <div className="stats">
        {/* Number of points */}
        <div className="stat">{"Points: " + points.length}</div>

        {/* Total Distance */}
        <div className="stat">{"Distance: " + totalDistance + " px"}</div>

        {/* Show different stats based off of the current algorithm */}
        {/* Brute Force Stats */}
        {currentAlgorithm == 5 && (
          <>
            <div className="stat">{"Permutations: " + totalPermutations}</div>
            <div className="stat">
              {"Progress: " + currentPermutation + " / " + totalPermutations}
            </div>
          </>
        )}

        {/* Help Button to Open Tutorial */}
        <div className="helpButton" onClick={() => setModalOpen(true)}>
          ?
        </div>
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

/// General Helper Functions ///

// Distance between 2 points
export function distance(point1: point, point2: point) {
  return Math.sqrt(
    (point1.x - point2.x) * (point1.x - point2.x) +
      (point1.y - point2.y) * (point1.y - point2.y)
  );
}

// Check if device is touchScreen
export function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Swap Elements in array
export function swap(array: any, pos1: number, pos2: number) {
  var temp = array[pos1];
  array[pos1] = array[pos2];
  array[pos2] = temp;
}

// Factorial Calculation
function factorialize(num: number) {
  if (num === 0 || num === 1) return 1;
  for (var i = num - 1; i >= 1; i--) {
    num *= i;
  }
  return num;
}
