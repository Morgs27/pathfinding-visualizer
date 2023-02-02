import { distance, point } from "../App"

type edge = {
    point1: point
    point1Index: number
    point2: point
    point2Index: number
    distance: number
    added : boolean
  }
  
type pointConnection = {
    point: point
    connections: number
}

// Greedy Algorithm
// Time Complexity - O(n^2log2(n))
// Within 15 - 20% of the Held-Karp lower bound

export function greedyAlgorithm(points_array: point[]){

    // Set N to number of points
    const N = points_array.length
  
    console.log('Points Array', points_array)
  
    // Setup array to hold all edges
    const edges: edge[] = []
    const completeEdges: edge[] = []
  
    // Setup array to hold information about point connections
    const pointConnections: pointConnection[] = points_array.map((point) => {
      return {point: point, connections: 0 }
    })
  
    ///// Get all edges
  
    // Loop through all points
    points_array.forEach((point1,index1) => {
  
      // Get all points to be connected to current point
      var points_to_be_connected: point[] = points_array.slice(index1 + 1)
  
      // Loop through points to be connected
      points_to_be_connected.forEach((point2,index2) => {
  
        // Add edge to edges array
        var edge = {point1: point1, point1Index: index1,  point2: point2, point2Index: index1 + 1 + index2 ,
        distance: distance(point1, point2), added: false}
        edges.push(edge)
  
      })
  
    })

    console.log(edges)
    
    // Sort edges by distance
    edges.sort((a,b) => {
      return a.distance - b.distance
    })
  
    // Add shortest edge to start
    pointConnections[edges[0].point1Index].connections += 1
    pointConnections[edges[0].point2Index].connections += 1
    edges[0].added = true;
    completeEdges.push(edges[0])
  
    // Add Edge Code Block
    while (completeEdges.length < N){
  
      var edgeAdded = false
      var index = 0
  
      while(!edgeAdded){
  
        index += 1
  
        var edge = edges[index]
  
        // Check edge is not already added
        if (edge.added){}
  
        // Check that neither point in edge already has 2 connections
        else if (pointConnections[edge.point1Index].connections == 2 
              || pointConnections[edge.point2Index].connections == 2){}
  
        // Check that adding this edge dosen't cause a closed cycle (unless this is the last edge to be added)
        else if (checkClosedLoop([...completeEdges, edge])
                && completeEdges.length != (N - 1))
                { console.log("Closed")}
  
        //  If all guards are passed add point
        else{
      
          pointConnections[edge.point1Index].connections += 1
          pointConnections[edge.point2Index].connections += 1
          edges[index].added = true;
    
          completeEdges.push(edge)
          edgeAdded = true;
          
        }
  
      }
  
    }
    
    return [completeEdges, edges];
  
  }
  
  
  
  function checkClosedLoop(some_edges: edge[]){
    
    // Map edge pointIndex's to pairs array
    var pairs: any = []
    some_edges.forEach((edge) => {
      pairs.push([edge.point1Index, edge.point2Index])
    })
    
    let solved = false;
  
    // For each pair
    pairs.forEach((pair: number[], pairIndex: number) => {
  
      if (!solved){
  
      // Value being looked for in the other pairs
      let targetValue = pair[0]
      let finalValue = pair[1]
  
      let pairsToBeTraversed = pairs
      pairsToBeTraversed.splice(pairIndex,1)
  
      let finding = true
  
      while(finding){
  
        finding = false;
  
        // Loop through all pairs apart from current pair
        pairsToBeTraversed.forEach((traversePair: number[], traverseIndex: number) => {
  
          if (traversePair[0] == targetValue){
  
            targetValue = traversePair[1]
            finding = true;
            pairsToBeTraversed.splice(traverseIndex, 1)

          }
  
          else if (traversePair[1] == targetValue){
  
            targetValue = traversePair[0]
            finding = true
            pairsToBeTraversed.splice(traverseIndex, 1)
  
          }
  
          
          if (targetValue == finalValue){

            finding = false;
            solved = true;
            return true;

          }
  
        })    
  
      }
      } 
      
    })
  
    if (solved){
      return true;
    }
  
    return false;
  
  }