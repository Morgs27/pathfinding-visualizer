import nearestInsertionAlgorithm from "../NearestInsertionAlgorithm";
import Point from "../../types/Point";
import { pathCost } from "../../functions/helpers";
import { describe, it, expect } from "@jest/globals";

describe("NearestInsertionAlgorithm", () => {
  it("should connect all points and return to start", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 1 },
      { x: 4, y: 0 },
    ];
    const result = await nearestInsertionAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath).toHaveLength(points.length + 1);
    expect(finalPath[0]).toEqual(finalPath[finalPath.length - 1]);
    expect(finalPath.slice(0, -1)).toEqual(
      expect.arrayContaining(points.map((p) => expect.objectContaining(p)))
    );
  });

  it("should return a path with the same start and end point", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ];
    const result = await nearestInsertionAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath[0]).toEqual(finalPath[finalPath.length - 1]);
  });

  it("should handle a single point", async () => {
    const points: Point[] = [{ x: 1, y: 1 }];
    const result = await nearestInsertionAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath).toHaveLength(2);
    expect(finalPath[0]).toEqual(expect.objectContaining(points[0]));
    expect(finalPath[1]).toEqual(expect.objectContaining(points[0]));
  });

  it("should return frames for visualization", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ];
    const result = await nearestInsertionAlgorithm(points);

    expect(result.length).toBeGreaterThan(1);
    expect(result[0].paths[0].path).toHaveLength(2);
    expect(result[result.length - 1].paths[0].path).toHaveLength(
      points.length + 1
    );
  });

  it("should mark all points in the final path as solved", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ];
    const result = await nearestInsertionAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    finalPath.forEach((point) => {
      expect(point).toHaveProperty("solved", true);
    });
  });

  it("should produce a path with a valid total distance", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 3, y: 4 },
      { x: 6, y: 8 },
    ];
    const result = await nearestInsertionAlgorithm(points);
    const finalFrame = result[result.length - 1];
    const finalPath = finalFrame.paths[0].path;

    const calculatedDistance = await pathCost(finalPath);
    expect(finalFrame.distance).toBeCloseTo(calculatedDistance);
  });
});
