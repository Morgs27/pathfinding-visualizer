import nearestNeighborAlgorithm from "../NearestNeighborAlgorithm";
import Point from "../../types/Point";
import { describe, it, expect } from "@jest/globals";

describe("NearestNeighborAlgorithm", () => {
  it("should connect all points and return to start", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 1 },
      { x: 4, y: 0 },
    ];
    const result = nearestNeighborAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath).toHaveLength(points.length + 1);
    expect(finalPath[0]).toEqual(finalPath[finalPath.length - 1]);
    expect(finalPath.slice(0, -1)).toEqual(expect.arrayContaining(points));
  });

  it("should handle a single point", () => {
    const points: Point[] = [{ x: 1, y: 1 }];
    const result = nearestNeighborAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath).toHaveLength(2);
    expect(finalPath[0]).toEqual(finalPath[1]);
    expect(finalPath[0]).toEqual(points[0]);
  });

  it("should return frames for visualization", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ];
    const result = nearestNeighborAlgorithm(points);

    expect(result.length).toBe(points.length);
    expect(result[0].paths[0].path).toHaveLength(2);
    expect(result[result.length - 1].paths[0].path).toHaveLength(
      points.length + 1
    );
  });

  it("should mark all points in the final path as solved", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    const result = nearestNeighborAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    finalPath.forEach((point) => {
      expect(point).toHaveProperty("solved", true);
    });
  });

  it("should always choose the nearest unvisited neighbor", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 0.5, y: 0.5 },
      { x: 2, y: 2 },
    ];
    const result = nearestNeighborAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    // The path should visit the closer point (0.5, 0.5) before (1, 1)
    expect(finalPath[1]).toEqual(expect.objectContaining({ x: 0.5, y: 0.5 }));
    expect(finalPath[2]).toEqual(expect.objectContaining({ x: 1, y: 1 }));
  });

  it("should handle points with the same coordinates", () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    const result = nearestNeighborAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath).toHaveLength(points.length + 1);
    expect(new Set(finalPath.map((p) => `${p.x},${p.y}`)).size).toBe(
      points.length - 1
    );
  });
});
