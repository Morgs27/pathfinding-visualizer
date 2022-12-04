import { useEffect, useRef, useState } from 'react'

// Import Dropdown
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

// Import App Styles
import './App.css'

// Import canvas drawing functions
import {plotPoints, clearCanvas, plotPath, plotLine} from './DrawFunctions'

// Import Icons
import {FaPlay} from 'react-icons/fa'

// Import UI Components
import { Slider } from './components/Slider'
import { ColourSelector } from './components/ColourSelector'
import { MenuIcon } from './components/MenuIcon'
import { FaSadCry } from 'react-icons/fa'

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

// Plot Point Function

// Solve Function Which updates canvas

function App() {

  // Refrences to container elements
  const canvas = useRef<HTMLCanvasElement>()
  const screen = useRef<HTMLDivElement>() // Reference to screen container
  const [screenDimensions, setScreenDimensions] = useState<dimensions>({width: 150, height: 150}) // Screen dimensions

  const [points, setPoints] = useState<point[]>([])

  const [speed, setSpeed] = useState(2)
  const [status, setStatus] = useState('');

  const algorithmNames = ['Brute Force', 'Ant Colony Optimization', 'Greedy Algorithm', 'Nearest Neighbour Algorithm']
  const algorithmFunctions = [runBruteForceAlgorithm,,, runNearestNeighborAlgorithm]
  const [currentAlgorithm, setCurrentAlgorithm ] = useState(3)

  var addingPoint:Boolean = false 

  // Add new point to points array and set all current points to solved = false
  function addPoint(event: any){
    if (!event.target.closest('.button')){
      setPoints((points) => {
        return [ 
          ...points.map((point) => {return {...point, solved: false}}), 
          {x: event.offsetX, y: event.offsetY, solved: false} ]
      })
    }
  }

  // Plot Points On first render and when points changes
  useEffect(() => {

    plotPoints(points);

  }, [screenDimensions, points])

  // Reset Points on algorithm change
  useEffect(() => {

    plotPoints(points);
    setPoints((points) => points.map((points) => {return {...points, solved : false}}))

  }, [currentAlgorithm])
    
  // Startup Function
  useEffect(() => {

    setScreenDimensions({width: screen?.current?.offsetWidth, height: screen?.current?.offsetHeight})

    window.addEventListener('resize', () => {
      setScreenDimensions({width: screen?.current?.offsetWidth, height: screen?.current?.offsetHeight})
    })

    window.addEventListener('click', (e) => {

      // If header is clicked on ignore
      if (!e.target.closest('.header')){

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

  function runBruteForceAlgorithm() {

    // Run calculation
    const [solution, permutations] = bruteForceAlgorithm(points)

    // Add Solution to end of list
    permutations.push(solution)

    const speeds = [1000,100,10]

    var counter = -1

    // Loop through all permutations showing them for 10ms
    permutations.forEach((path: point[], index: number) => {
        
      setTimeout(() => {

        counter += 1
        clearCanvas()
        plotPath(path)
        plotPoints(points)
        setStatus(counter + ' / ' + (permutations.length - 1))
        

      },index * speeds[speed])

    })

  }

  function runNearestNeighborAlgorithm(){

    console.log(points)

    const [steps, path] = nearestNeighborAlgorithm(points)

    const points_array: point[] = points.map((point) => {
      return {...point, solved: false}
    });

    var completed_path: point[] = []

    path.forEach((pointIndex : number, index : number) => {


      setTimeout(() => {

        completed_path.push(points_array[pointIndex])

        clearCanvas()

        plotPath(completed_path, 'orange')

        if (index != path.length - 1){

          var stepDistances = steps[index][0]

          var minDistance = steps[index][1]

          stepDistances.forEach((distance: number | null, index: number) => {

            if (distance != null){
   
              var lineStrength = Math.pow(Math.round((1 / (distance / minDistance)) * 100) / 100, 4)

              var colour = 'rgba(255,255,255,' + lineStrength + ')';
              plotLine(points_array[pointIndex], points_array[index], colour)
            }

          })

        }

        points_array[pointIndex].solved = true;
        plotPoints(points_array)
       
      },index * 1000)

    })

  }


  return (
   <>
   <div className="screen" ref = {screen}>

    <canvas className="canvas" id = 'canvas' width = { screenDimensions.width | 150} height = {screenDimensions.height | 150} ref={canvas} ></canvas>

    <div className="header">
      
      <div className="option">
        <div className="optionTitle">ALGORITHM</div>
        <Dropdown 
        options={algorithmNames} 
        onChange={(e) => {
          setCurrentAlgorithm(algorithmNames.indexOf(e.value))
        }} 
        value={algorithmNames[currentAlgorithm]} 
        placeholder="Select an algorithm"
        />
      </div>

      <button  className="run" onClick = {() => {algorithmFunctions[currentAlgorithm]()}} >
        Run <FaPlay className='icon'></FaPlay>
      </button>

    </div>

    <div className="stats">
      <div className="stat" id = 'status'>{status}</div>
    </div>
    

   </div>
   </>
  )
}

export default App

// Distance between 2 points
function distance(point1: point, point2: point) {
  return Math.sqrt(
    (point1.x - point2.x) * (point1.x - point2.x) +
      (point1.y - point2.y) * (point1.y - point2.y),
  );
}

// Check if device is touchScreen
function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0))
}

// Swap Elements in array
function swap (array: any, pos1: number, pos2: number) {
  var temp = array[pos1];
  array[pos1] = array[pos2];
  array[pos2] = temp;
};

// Brute Force Algorithm - Try all possible compinations
// Guarentees Shortest Distance
// Time complexity O(n!)
function bruteForceAlgorithm(points: point[]){

  // Set Initial Min Distance
  var bestDistance = getSolutionDistance(points);

  // Set Initial Solution to given points order
  var solution = points;

  // Create all permutations of the points array
  const permutations = heapsPermute(points)

  // Heaps Algorithm - Generates all possible permutations of points array
  function heapsPermute (array: point[], n? : number, results: any[] = []) {
    n = n || array.length;
    if (n === 1) {

      results.push(array.slice());

      evaluateSolution(array.slice())

    } 
    else {
      for (var i = 1; i <= n; i += 1) {

        heapsPermute(array, n - 1, results);

        if (n % 2) {
          var j = 1;
        } 
        else {
          var j = i;
        }
        swap(array, j - 1, n - 1);
      }
    }
    return results;
  };

  // Get total distance for a solution
  function getSolutionDistance(points_array: point[]){
    var solutionDistance = 0

    points_array.forEach((point,index) => {
      var nextIndex = (index + 1) % points_array.length
      solutionDistance += distance(point, points_array[nextIndex])
    })

    return solutionDistance
  }

  // Evaluate solution
  function evaluateSolution(points_array: point[]){
    
    var solutionDistance = getSolutionDistance(points_array)

    if (solutionDistance < bestDistance){

      bestDistance = solutionDistance
      solution = points_array
    
    }
  }

  // Add connection back to original point
  solution.push(solution[0])

  return [solution, permutations]

}


// Nearest Neighbor Algorithm
// Time Complexity - O(n^2)
// Within 25% of the Held-Karp lower bound

function nearestNeighborAlgorithm(points: point[]){

  // Generate random index for starting point
  var randomIndex = Math.floor(Math.random() * points.length)
  
  // Add first point to path
  var path : any = [randomIndex]

  // Setup array to hold info about each step to help with display
  var steps = []

  // Set starting point to solved
  points[randomIndex].solved = true

  // Start Recursive loop that ends when path is solved
  var pathSolved = false
  while (!pathSolved){

    // Get info on working point
    var currentPoint = points[path[path.length - 1]]

    // Setup array to hold distances between points
    var stepDistances: number[] = []

    // Setup variable to hold index of the next point (closest point)
    var nextPointIndex: number | null = null

    // Set minimum distance so number larger than it could possibly be
    var minDistance = 10000000

    // For each point that is not solved find the distance between the points
    // If the distance is lower than the max
    // Update the next point and minimum distance
    points.forEach((point,index) => {

      if (point.solved != true){

        var pointDistance = distance(currentPoint, point)

        stepDistances.push(pointDistance)

        if (pointDistance < minDistance){

          nextPointIndex = index
          minDistance = pointDistance

        }

      }
      else{
        stepDistances.push(null)
      }

    })

    // If there are no more points that are not solved
    // Exit while loop and push path back to starting point
    if (nextPointIndex == null){

      pathSolved = true
      steps.push([Array(points.length).fill(null), 0])
      path.push(path[0])

    }

    // If there are more points to be solved
    // Push current solved point
    else {

      steps.push([stepDistances, minDistance])
      points[nextPointIndex].solved = true
      path.push(nextPointIndex)

    }

  }

  return [steps, path]
}

// Greedy Algorithm
// Time Complexity - O(n^2log2(n))
// Within 15 - 20% of the Held-Karp lower bound
function greedyAlgorithm(){

}
// 