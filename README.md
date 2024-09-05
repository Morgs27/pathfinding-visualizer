# TSP Visualizer 

###### Visualize algorithms for the Traveling Salesman Problem

The TSP describes a scenario where a salesman is required to travel
between <InlineMath>n</InlineMath> cities. He wishes to travel to all
locations exactly once and he must finish at his starting point. The
order in which the cities are visited is not important but he wishes
to minimize the distance traveled.

Live at: 
[tspvisualiser.dev](https://tspvisualiser.dev/)

![image](https://github.com/user-attachments/assets/8acd2922-128a-4720-8db4-9269f4203934)

## Getting Started Locally

###### To run the TSP Visualizer locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/tsp-visualizer.git
   cd tsp-visualizer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the port specified in the console output).

## Adding a New Algorithm

###### To add a new algorithm to the TSP Visualizer, follow these steps:

1. Create a new file in the `src/algorithms` directory with your algorithm implementation. For example, `MyNewAlgorithm.ts`.

2. Implement your algorithm function. It should take an array of `Point` objects as input and return an array of `Frame` objects. Here's a basic template:

   ```typescript
   import Point from "../types/Point";
   import { Frame } from "../functions/visualiseAlgorithm";

   function myNewAlgorithm(points: Point[]): Frame[] {
     const frames: Frame[] = [];
     // Implement your algorithm here
     // Add frames as your algorithm progresses
     return frames;
   }

   export default myNewAlgorithm;
   ```

3. Add your algorithm to the `src/config/Algorithms.ts` file
4. Optionaly add a test to `src/algorithms/__tests__` ~ tests can be ran with `npm run test`




