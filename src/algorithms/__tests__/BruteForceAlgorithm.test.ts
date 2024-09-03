import bruteForceAlgorithm from "../BruteForceAlgorithm";
import { expect, it, describe } from "@jest/globals";
import Point from "../../types/Point";

describe("BruteForceAlgorithm", () => {
  it("should return correct result for 3 points", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 4 },
    ];
    const result = await bruteForceAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;
    const finalDistance = result[result.length - 1].distance;

    expect(finalPath.length).toBe(4);
    expect(finalDistance).toBeCloseTo(12, 5);
  });

  it("should return all permutations", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    const result = await bruteForceAlgorithm(points);

    expect(result.length).toBe(7);
  });

  it("should handle empty input", async () => {
    const points: Point[] = [];
    const result = await bruteForceAlgorithm(points);

    expect(result.length).toBe(1);
    expect(result[0].paths[0].path).toEqual([]);
    expect(result[0].distance).toBe(0);
  });
});
