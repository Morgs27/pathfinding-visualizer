import { useEffect, useRef, useState } from 'react'

// Import Dropdown Component
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

// Import App Styles
import './App.css'

// Import Icons
import {FaAngleDown, FaAngleUp, FaPlay} from 'react-icons/fa'
import {BsFillStopCircleFill} from 'react-icons/bs'

// Import Algorithms
import { greedyAlgorithm } from './algorithms/GreedyAlgorithm';
import { bruteForceAlgorithm } from './algorithms/BruteForceAlgorithm';
import { nearestNeighborAlgorithm } from './algorithms/NearestNeighborAlgorithm';

// Import canvas drawing functions
import {plotPoints, clearCanvas, plotPath, plotLine} from './DrawFunctions'

// Import Equation visualizer
import {Equation} from 'react-equation'

// Import Components
import {TutorialModal, Page} from './components/TutorialModal';

type dimensions = {
  width: number | undefined
  height: number | undefined
}

export type point = {
  x: number
  y: number
  solved? : boolean
}

type ant = {
  x: number
  y: number
  direction: number
  status: []
  lines: []
}

function App() {

  // Refrences to container elements
  const canvas = useRef<HTMLCanvasElement>()
  const screen = useRef<HTMLDivElement>() 

  // Menu State
  const [menuOpen, setMenuOpen] = useState(true);

  // Tutorial Modal State
  const [modalOpen, setModalOpen] = useState(true);

  // Screen Dimensions
  const [screenDimensions, setScreenDimensions] = useState<dimensions>({width: 150, height: 150}) // Screen dimensions

  // Points 
  const [points, setPoints] = useState<point[]>([])
  var addingPoint:Boolean = false 

  // Algorithm Information in Parallel Arrays
  const algorithmNames = ['Brute Force', 'Ant Colony Optimization', 'Greedy Algorithm', 'Nearest Neighbour Algorithm']
  const algorithmFunctions = [runBruteForceAlgorithm,runAntColonyAlgorithm,runGreedyAlgorithm, runNearestNeighborAlgorithm]
  const algorithmTimeComplexities = ['O(n)', 'O(n)', 'O(n^2log2(n))' , 'O(n^2)']
  const algorithmAccuracy = ['100%', '', '80-85%', '75%']
  const [currentAlgorithm, setCurrentAlgorithm ] = useState(2)

  // Algorithm Running State
  const running = useRef<Boolean>(false)
  const [runningState, setRunningState] = useState<Boolean>(false)

  // Speed
  const [speed, setSpeed] = useState<number>(10);

  // Stats for each algorithm
  const [currentPermutation, setCurrentPermutation] = useState(0)
  const [totalPermutations, setTotalPermutations] = useState(0)
  const [totalDistance, setTotalDistance] = useState(0)
  const [completedEdges, setCompletedEdges] = useState(0)

  // Add new point to points array with time delay to stop spamming
  function addPoint(event: any){
    if (!event.target.closest('.button') || !modalOpen){
      setPoints((points) => {
        return [ 
          ...points.map((point) => {return {...point, solved: false}}), 
          {x: event.offsetX, y: event.offsetY, solved: false} ]
      })
      checkDuplicatePoints()
    }
  }

  // Add x number of points to screen
  function addPoints(number: number){

    setPoints((points) => [...points, ...Array(number).fill(undefined).map((point) => {
      return {x: Math.random() * screenDimensions.width, y: Math.random() * screenDimensions.height , solved: false}
    })])
    checkDuplicatePoints()
    
  }

  function checkDuplicatePoints(){
    setPoints((points) => {
      return [...new Map(points.map((point) => [point.x,point])).values()]
    })
  }

  // Plot Points on first render and when points changes
  useEffect( () => {

    clearCanvas()

    plotPoints(points);

    setTimeout(() => {
      plotPoints(points)
    }, 50);

    // Update permutations stat
    let total = factorialize(points.length)
    setTotalPermutations(total)

  }, [screenDimensions, points])

  // Reset Points on algorithm change
  useEffect(() => {

    algorithmFinished()

  }, [currentAlgorithm])
    
  // Startup Function - Only runs on first render
  useEffect(() => {

    setScreenDimensions({width: screen?.current?.offsetWidth, height: screen?.current?.offsetHeight})

    window.addEventListener('resize', () => {
      setScreenDimensions({width: screen?.current?.offsetWidth, height: screen?.current?.offsetHeight})
    })

    window.addEventListener('click', (e) => {

      // If header is clicked on ignore
      if (!(e.target as Element).closest('.header')){

        // Ensures that points are not spammed
        if (addingPoint == false){

          addingPoint = true

          addPoint(e)

          setTimeout(() => {
            addingPoint = false
          }, 300);

        }

      }

    })
    
  }, [])

  // Run/Diplay Brute Force Algorithm
  async function runBruteForceAlgorithm() {

    console.log('started')

    bruteForceAlgorithm(points).then()

    // Run calculation
    const [solution, permutations] = await bruteForceAlgorithm(points)

    console.log('finished')

    setTotalPermutations(permutations.length)

    // Add Solution to end of list
    permutations.push(solution)

    var counter = -1

    var timeouts: any = [];

    // Loop through all permutations showing them for 10ms
    permutations.forEach((path: point[], index: number) => {
        
      timeouts.push(setTimeout(() => {

        if (running.current){
          counter += 1
          clearCanvas()
          plotPath(path)
          plotPoints(points)
          setCurrentPermutation(counter)
          timeouts.shift()
        }
        else {
          timeouts.forEach((timeout: any) => {
            clearTimeout(timeout)
          })
          algorithmFinished()
        }

        // When the algorithm is completed displaying
        if (index == permutations.length - 1 ){

          // Calculate distance between all points
          let totalDistance = 0
          solution.forEach((point: point, index) => {
            if (index != 0){
              totalDistance += distance(point, solution[index - 1])
            }
          })

          // Set total distance
          setTotalDistance(Math.floor(totalDistance))

          algorithmFinished()
        }

      },index * 2 * speed))

    })

  }

   // Run/Diplay Nearest Neighbor Algorithm
  function runNearestNeighborAlgorithm(){

    // Run the algorithm 
    const [steps, path] = nearestNeighborAlgorithm(points)

    // Create an idendical array to points
    const points_array: point[] = points.map((point) => {
      return {...point, solved: false}
    });

    // Setup array to hold the points in the completed path
    var completed_path: point[] = []

    // Setup array to hold all the timeouts/frames
    var timeouts: any[] = []

    // Loop through all the points in the path
    path.forEach((pointIndex : number, index : number) => {

      // Create frame then add to timeouts array
      timeouts.push(setTimeout(() => {
        
        // If running
        if (running.current){

          // Add current point to the completed path
          completed_path.push(points_array[pointIndex])

          clearCanvas()

          // Plot the so far completed path
          plotPath(completed_path, 'orange')

          // If not on the last point
          if (index != path.length - 1){

            // Add distance to total 
            if (completed_path.length > 1){
              setTotalDistance((prevDistance) => prevDistance + Math.floor(distance(completed_path.at(-1), completed_path.at(-2))))
            }

            var stepDistances = steps[index][0]
            var minDistance = steps[index][1]

            // Display a line for each of the options from the current point
            // with opacity proportionalized to the distance
            stepDistances.forEach((distance: number | null, index: number) => {

              if (distance != null){
    
                var lineStrength = Math.pow(Math.round((1 / (distance / minDistance)) * 100) / 100, 4)

                var colour = 'rgba(255,255,255,' + lineStrength + ')';

                plotLine(points_array[pointIndex], points_array[index], colour)
              }

            })

          }
          
          // Set current point to solved and update the points
          points_array[pointIndex].solved = true;
          plotPoints(points_array)

          // Remove current frame from list of frames
          timeouts.shift()

        }
        else {

          // If algorithm is stopped
          // Clear all the frames that are still to run
          timeouts.forEach((timeout: any) => {
            clearTimeout(timeout)
          })
          algorithmFinished()

        }

        // If all the frames have ran end the algorithm
        if (timeouts.length == 0){
          algorithmFinished()
        }
       
      },index * 10 * speed))

    })

  }

  // Run/Diplay Greedy Algorithm Algorithm
  function runGreedyAlgorithm(){
    
    /// Run Algorithm ///
    const [edges, allEdges] = greedyAlgorithm(points)

    /// Display Algorithm ///

    // Create array to hold all the frames
    var timeouts: any[] = []

    // Loop through path edges
    edges.forEach((edge, index) => {

      // Create frame and add to array
      timeouts.push(setTimeout(() => {

        // If algorithm is running
        if (running.current){

          // Add distance of current edge to total
          setTotalDistance((distance) => Math.floor(distance + edge.distance))

          let currentPath = edges.filter((edge, filterIndex) => {
            return filterIndex <= index
          })

          let prevPath = edges.filter((edge, filterIndex) => {
            return filterIndex < index
          })

          // Loop through all possible edges between points
          // Display a line between them proportional to the distance
          allEdges.forEach((edge, allEdgesIndex) => {
            let opacity = Math.pow(1 - (allEdgesIndex / allEdges.length) , 4) / 4
            plotPath([edge.point1, edge.point2], 'rgba(255,255,255,' + opacity + ')')
          })

          // Plot all the lines completed in previous frames
          prevPath.forEach((edge) =>{
            plotPath([edge.point1, edge.point2])
          })

          // After a delay plot the next edge
          setTimeout(() => {

            clearCanvas()
            plotPoints(points)

            currentPath.forEach((edge) =>{
              plotPath([edge.point1, edge.point2])
            })

          }, 5 * speed);

          timeouts.shift()
         
        }
        else {
          // If algorithm is stopped
          // Clear all the frames that are still to run
          timeouts.forEach((timeout: any) => {
            clearTimeout(timeout)
          })
          algorithmFinished()
        }

        // If all the frames have ran end the algorithm
        if (timeouts.length == 0){
          algorithmFinished()
        }

      }, index * 10 * speed));

    })


  }

  // Run/ Display Ant Colony Algorithm
  function runAntColonyAlgorithm(){

  }

  // Function to run before any algorithm
  function algorithmSetup(){

    if (currentAlgorithm == 0){
      if (points.length > 11){
        window.alert('Calculation too expensive for the browser, try using less than 10 points when running the Brute Force algorithm.')
        return;
      }
    }

    if (points.length == 0){
      window.alert('Add some points to run the algorithm');
      return;
    }

    // Clear Canvas
    setPoints((points) => points.map((points) => {return {...points, solved : false}}))
    clearCanvas()
    plotPoints(points)

    // Setup Running
    running.current = true; 
    setRunningState(true); 

    // Reset Stats
    setTotalDistance(0)
    setCurrentPermutation(0)
    
    // Run Function 
    algorithmFunctions[currentAlgorithm]()

  }

  // Function to run when any algorithm is finished
  function algorithmFinished(){

    running.current = false;
    setRunningState(false);
    
  }

  function toggleMenu(){
    setMenuOpen((menuOpen) => !menuOpen)
  }

  return (
   <div className = 'container'>

    <TutorialModal state = {modalOpen} setState = {setModalOpen}>
      <Page >
        <h3>Welcome to TSP Visualizer</h3>
        <p><i>TSP - Traveling Salesman Problem</i></p>
        <img height = {150} src="./location-dot-orange.png" alt="" />
        <p>This short tutorial will walk you through all the features of this application.</p>
      </Page>
      <Page >b content</Page>
      <Page >c content</Page>
    </TutorialModal>

    <div className="header" data-menu = {menuOpen? 'open' : 'close'} >
      
      {/* Algorithm Selector Dropdown */}
      <div className="option">

        <div className="optionTitle">ALGORITHM</div>

        <div className="optionContent">
            <Dropdown 
            options={algorithmNames} 
            onChange={(e) => {
              setCurrentAlgorithm(algorithmNames.indexOf(e.value))
            }} 
            value={algorithmNames[currentAlgorithm]} 
            placeholder="Select an algorithm"
            />
        </div>

      </div>

      {/* Points adding buttons */}
      <div className="option">

        <div className="optionTitle">POINTS</div>

        <div className="optionContent">
            <div className="buttonGroup">
              <button onClick={() => addPoints(1)}>1 +</button>
              <button onClick={() => addPoints(5)}>5 +</button>
              <button onClick={() => addPoints(10)}>10 +</button>
              <button onClick = {() => {setPoints([]); clearCanvas()} } style = {{borderColor: 'rgba(255,255,255,0.6)', color: 'rgba(255,255,255,0.6)'}} >Clear</button>
            </div>
        </div>

      </div>

      {/* Speed Buttons */}
      <div className="option">

        <div className="optionTitle">TIME DELAY</div>

        <div className="optionContent">
            <div className="buttonGroup">
              <button data-active = {speed == 1? 'true' : 'false'} onClick={() => setSpeed(1)}>1</button>
              <button data-active = {speed == 10? 'true' : 'false'} onClick={() => setSpeed(10)}>10</button>
              <button data-active = {speed == 100? 'true' : 'false'} onClick={() => setSpeed(100)}>100</button>
            </div>
        </div>

      </div>


      <div className="option">
        <div className="optionTitle">
            TIME COMPLEXITY
        </div>

        <div className="optionContent">
          <Equation value = {algorithmTimeComplexities[currentAlgorithm]}></Equation>
        </div>
      </div>

      <div className="option">
        <div className="optionTitle">
            ACCURACY
        </div>

        <div className="optionContent">
          {algorithmAccuracy[currentAlgorithm]}
        </div>
      </div>

      {/* Run Button */}
      <div className="option" style = {{placeItems: 'center', gridTemplateRows: '1fr'}}>


            {runningState ?
            <button style = {{backgroundColor: 'transparent', color: 'orange'}} className="run" onClick = {() => {running.current = false; setRunningState(false)}} >
            Stop <BsFillStopCircleFill className='icon'></BsFillStopCircleFill>
            </button>
            : 
            <button  className="run" onClick = {() => algorithmSetup()} >
            Run <FaPlay className='icon'></FaPlay>
            </button>
            }

      </div>
    </div>

    {/* Header Close Button */}
    <div className="headerClose" onClick={() => toggleMenu()}>
      {
        menuOpen?
        <FaAngleUp></FaAngleUp>
        :
        <FaAngleDown></FaAngleDown>
      }
    </div>

    {/* Stats Bar */}
    <div className="stats">

      {/* Number of points */}
      <div className='stat'>{"Points: " + points.length}</div>

      {/* Speed */}
      <div className='stat'>{"Speed: " + speed}</div>

      {/* Total Distance */}
      <div className='stat'>{"Distance: " + totalDistance + " px"}</div>


      {/* Show different stats based off of the current algorithm */}
      {/* Brute Force Stats */}
      {currentAlgorithm == 0 && 
        (
          <>
          <div className='stat'>{"Permutations: " + totalPermutations }</div>
          <div className='stat'>{"Progress: " + currentPermutation + ' / ' + totalPermutations }</div>
          </>
        )
      }

      {/* Greedy Algorithm Stats */}
      {currentAlgorithm == 2 && 
        (
          <>
          </>
        )
      }

      {/* Nearest Neighbour Stats */}
      {currentAlgorithm == 3 && 
        (
          <>
          </>
        )
      }

      {/* Ant Colony Optomisation Stats */}
      {currentAlgorithm == 1 && 
        (
          <>
          </>
        )
      }

      <div className="helpButton" onClick={() => setModalOpen(true)}>
        ?
      </div>
    </div>
    
    {/* Canvas Container */}
    <div className="screen" ref = {screen}>

      <canvas className="canvas" id = 'canvas' width = { screenDimensions.width | 150} height = {screenDimensions.height | 150} ref={canvas} ></canvas>

    </div>

   </div>
  )
}

export default App


/// General Helper Functions ///

// Distance between 2 points
export function distance(point1: point, point2: point) {
  return Math.sqrt(
    (point1.x - point2.x) * (point1.x - point2.x) +
      (point1.y - point2.y) * (point1.y - point2.y),
  );
}

// Check if device is touchScreen
export function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0))
}

// Swap Elements in array
export function swap (array: any, pos1: number, pos2: number) {
  var temp = array[pos1];
  array[pos1] = array[pos2];
  array[pos2] = temp;
};

// factorial calculation
function factorialize(num: number) {
  if (num === 0 || num === 1)
    return 1;
  for (var i = num - 1; i >= 1; i--) {
    num *= i;
  }
  return num;
}




