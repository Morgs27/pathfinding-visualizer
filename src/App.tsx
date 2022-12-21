import { useEffect, useRef, useState } from 'react'

// Import Dropdown Component
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

// Import App Styles
import './App.css'

// Import Icons
import {FaPlay} from 'react-icons/fa'

// Import Algorithms
import { greedyAlgorithm } from './algorithms/GreedyAlgorithm';
import { bruteForceAlgorithm } from './algorithms/BruteForceAlgorithm';
import { nearestNeighborAlgorithm } from './algorithms/NearestNeighborAlgorithm';

// Import canvas drawing functions
import {plotPoints, clearCanvas, plotPath, plotLine} from './DrawFunctions'

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
  const screen = useRef<HTMLDivElement>() // Reference to screen container
  const [screenDimensions, setScreenDimensions] = useState<dimensions>({width: 150, height: 150}) // Screen dimensions

  // Points array
  const [points, setPoints] = useState<point[]>([])
  var addingPoint:Boolean = false 

  const algorithmNames = ['Brute Force', 'Ant Colony Optimization', 'Greedy Algorithm', 'Nearest Neighbour Algorithm']
  const algorithmFunctions = [runBruteForceAlgorithm,runAntColonyAlgorithm,runGreedyAlgorithm, runNearestNeighborAlgorithm]
  const [currentAlgorithm, setCurrentAlgorithm ] = useState(2)

  const [status, setStatus] = useState("")

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

  function addRandomPoints(){

    setPoints((points) => [...points, ...Array(10).fill(undefined).map((point) => {
      return {x: Math.random() * screenDimensions.width, y: Math.random() * screenDimensions.height , solved: false}
    })])
    
  }

  // Plot Points on first render and when points changes
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
  function runBruteForceAlgorithm() {

    // Run calculation
    const [solution, permutations] = bruteForceAlgorithm(points)

    // Add Solution to end of list
    permutations.push(solution)

    var counter = -1

    // Loop through all permutations showing them for 10ms
    permutations.forEach((path: point[], index: number) => {
        
      setTimeout(() => {

        counter += 1
        clearCanvas()
        plotPath(path)
        plotPoints(points)
        setStatus(counter + ' / ' + (permutations.length - 1))
        

      },index * 100)

    })

  }

   // Run/Diplay Nearest Neighbor Algorithm
  function runNearestNeighborAlgorithm(){

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

  // Run/Diplay Greedy Algorithm Algorithm
  function runGreedyAlgorithm(){
    
    const [edges, allEdges] = greedyAlgorithm(points)

    edges.forEach((edge, index) => {

      setTimeout(() => {

        let currentPath = edges.filter((edge, filterIndex) => {
          return filterIndex <= index
        })

        let prevPath = edges.filter((edge, filterIndex) => {
          return filterIndex < index
        })

        allEdges.forEach((edge, allEdgesIndex) => {
          let opacity = Math.pow(1 - (allEdgesIndex / allEdges.length) , 4)
          console.log(opacity)
          plotPath([edge.point1, edge.point2], 'rgba(255,255,255,' + opacity + ')')
        })

        prevPath.forEach((edge) =>{
          plotPath([edge.point1, edge.point2])
        })

        setTimeout(() => {

          clearCanvas()
          plotPoints(points)

          currentPath.forEach((edge) =>{
            plotPath([edge.point1, edge.point2])
          })

        }, 1000);

      }, index * 2000);

    })


  }

  // Run/ Display Ant Colony Algorithm
  function runAntColonyAlgorithm(){

  }

  return (
   <div className = 'container'>

    <div className="header" >
      
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

      <div className="option">
        <button   onClick = {() => {addRandomPoints()}} >
         Add Random
        </button>
      </div>

      <button  className="run" onClick = {() => {algorithmFunctions[currentAlgorithm]()}} >
        Run <FaPlay className='icon'></FaPlay>
      </button>

    </div>

    <div className="stats">
      <div className="stat" id = 'status'>{status}</div>
    </div>
    
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


