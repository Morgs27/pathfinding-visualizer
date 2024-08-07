import point from "../types/Point";
import { Frame } from "../functions/runAlgorithm";
import AntColonyOptions from "../types/AntColonyOptions";

async function antColonyAlgorithm(
  points: point[],
  { alpha, beta, evaporationRate, Q, numAnts, numIterations }: AntColonyOptions
) {
  const frames: Frame[] = [];

  // Initialize pheromone levels
  const pheromones = Array(points.length)
    .fill(null)
    .map(() => Array(points.length).fill(1));

  // Function to calculate the distance between two points
  function distance(point1: point, point2: point): number {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  }

  // Function to choose the next point based on pheromone levels and distances
  function chooseNextPoint(currentPoint: number, visited: boolean[]): number {
    const probabilities = points.map((_, index) => {
      if (visited[index]) return 0;
      const pheromone = Math.pow(pheromones[currentPoint][index], alpha);
      const dist = Math.pow(
        1 / distance(points[currentPoint], points[index]),
        beta
      );
      return pheromone * dist;
    });

    const sum = probabilities.reduce((a, b) => a + b, 0);
    const random = Math.random() * sum;

    let cumulative = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (cumulative >= random) return i;
    }

    return -1;
  }

  // Main loop
  for (let iteration = 0; iteration < numIterations; iteration++) {
    const allPaths: number[][] = [];
    const allDistances: number[] = [];

    for (let ant = 0; ant < numAnts; ant++) {
      const visited = Array(points.length).fill(false);
      const path = [Math.floor(Math.random() * points.length)];
      visited[path[0]] = true;

      while (path.length < points.length) {
        const nextPoint = chooseNextPoint(path[path.length - 1], visited);
        path.push(nextPoint);
        visited[nextPoint] = true;
      }

      path.push(path[0]); // return to the starting point
      allPaths.push(path);

      const pathDistance = path.reduce((acc, curr, index) => {
        if (index === 0) return acc;
        return acc + distance(points[path[index - 1]], points[curr]);
      }, 0);
      allDistances.push(pathDistance);
    }

    // Update pheromones
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points.length; j++) {
        pheromones[i][j] *= 1 - evaporationRate;
      }
    }

    for (let ant = 0; ant < numAnts; ant++) {
      const contribution = Q / allDistances[ant];
      for (let i = 0; i < allPaths[ant].length - 1; i++) {
        const from = allPaths[ant][i];
        const to = allPaths[ant][i + 1];
        pheromones[from][to] += contribution;
        pheromones[to][from] += contribution;
      }
    }

    // Save the paths of all ants in the current iteration
    const paths = allPaths.map((path, index) => ({
      path: path.map((pointIndex) => points[pointIndex]),
      distance: allDistances[index],
    }));

    frames.push({
      paths,
      distance: Math.min(...allDistances),
    });
  }

  return frames;
}

export default antColonyAlgorithm;
