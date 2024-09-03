import antColonyAlgorithm from "../AntColonyAlgorithm";
import Point from "../../types/Point";
import AntColonyOptions from "../../types/AntColonyOptions";
import { describe, expect, test } from "@jest/globals";

describe("Ant Colony Algorithm", () => {
  const testPoints: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 7, y: 3 },
    { x: 6, y: 4 },
    { x: 1, y: 3 },
  ];

  const defaultOptions: AntColonyOptions = {
    alpha: 1,
    beta: 2,
    evaporationRate: 0.1,
    Q: 1,
    numAnts: 5,
    numIterations: 10,
  };

  test("should return the correct number of frames", async () => {
    const frames = await antColonyAlgorithm(testPoints, defaultOptions);
    expect(frames.length).toBe(defaultOptions.numIterations);
  });

  test("each frame should contain paths for all ants", async () => {
    const frames = await antColonyAlgorithm(testPoints, defaultOptions);
    frames.forEach((frame) => {
      expect(frame.paths.length).toBe(defaultOptions.numAnts);
    });
  });

  test("each path should visit all points and return to start", async () => {
    const frames = await antColonyAlgorithm(testPoints, defaultOptions);
    frames.forEach((frame) => {
      frame.paths.forEach((path) => {
        expect(path.path.length).toBe(testPoints.length + 1);
        expect(path.path[0]).toEqual(path.path[path.path.length - 1]);
      });
    });
  });

  test("should improve solution over iterations", async () => {
    const frames = await antColonyAlgorithm(testPoints, defaultOptions);
    const firstDistance = frames[0].distance;
    const lastDistance = frames[frames.length - 1].distance;
    expect(lastDistance).toBeLessThanOrEqual(firstDistance!);
  });
});
