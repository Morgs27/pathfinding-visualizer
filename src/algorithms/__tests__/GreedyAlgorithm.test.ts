import greedyAlgorithm from "../GreedyAlgorithm";
import Point from "../../types/Point";
import { describe, it, expect } from "@jest/globals";

describe("GreedyAlgorithm", () => {
  it("should connect all points for a simple square", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
    ];
    const result = greedyAlgorithm(points);
    const finalPath = result[result.length - 1].paths;

    expect(finalPath).toHaveLength(4);
    expect(finalPath.flatMap((p) => p.path)).toEqual(
      expect.arrayContaining(points)
    );
  });

  it("should handle collinear points", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    const result = greedyAlgorithm(points);
    const finalPath = result[result.length - 1].paths;

    expect(finalPath).toHaveLength(4);
    expect(finalPath.flatMap((p) => p.path)).toEqual(
      expect.arrayContaining(points)
    );
  });

  it("should connect all points for a more complex shape", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 4, y: 0 },
      { x: 3, y: -2 },
      { x: 1, y: -2 },
    ];
    const result = greedyAlgorithm(points);
    const finalPath = result[result.length - 1].paths;

    expect(finalPath).toHaveLength(5);
    expect(finalPath.flatMap((p) => p.path)).toEqual(
      expect.arrayContaining(points)
    );
  });

  it("should return frames for visualization", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ];
    const result = greedyAlgorithm(points);

    expect(result.length).toBeGreaterThan(1);
    expect(result[0].paths).toHaveLength(1);
    expect(result[result.length - 1].paths).toHaveLength(3);
  });

  it("should not create closed loops before connecting all points", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
      { x: 3, y: 1 },
    ];
    const result = greedyAlgorithm(points);
    const finalPath = result[result.length - 1].paths;

    expect(finalPath).toHaveLength(4);
    expect(finalPath.flatMap((p) => p.path)).toEqual(
      expect.arrayContaining(points)
    );

    const firstThreeEdges = finalPath.slice(0, 3);
    const uniquePoints = new Set(
      firstThreeEdges.flatMap((edge) => [edge.path[0], edge.path[1]])
    );
    expect(uniquePoints.size).toBe(4);
  });
});
