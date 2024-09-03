import convexHullAlgorithm from "../ConvexHullAlgorithm";
import Point from "../../types/Point";
import { describe, it, expect } from "@jest/globals";

describe("ConvexHullAlgorithm", () => {
  it("should visit all points for a simple square", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
    ];
    const result = await convexHullAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath).toHaveLength(points.length + 1);
    expect(finalPath[0]).toEqual(finalPath[finalPath.length - 1]);
    expect(finalPath.slice(0, -1)).toEqual(expect.arrayContaining(points));
  });

  it("should handle collinear points", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
    ];
    const result = await convexHullAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath).toHaveLength(points.length + 1);
    expect(finalPath[0]).toEqual(finalPath[finalPath.length - 1]);
    expect(finalPath.slice(0, -1)).toEqual(expect.arrayContaining(points));
  });

  it("should visit all points for a convex polygon", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 4, y: 0 },
      { x: 3, y: -2 },
      { x: 1, y: -2 },
    ];
    const result = await convexHullAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath).toHaveLength(points.length + 1);
    expect(finalPath[0]).toEqual(finalPath[finalPath.length - 1]);
    expect(finalPath.slice(0, -1)).toEqual(expect.arrayContaining(points));
  });

  it("should visit all points including those inside the convex hull", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
      { x: 2, y: 2 },
      { x: 1, y: 1 },
      { x: 3, y: 3 },
    ];
    const result = await convexHullAlgorithm(points);
    const finalPath = result[result.length - 1].paths[0].path;

    expect(finalPath).toHaveLength(points.length + 1);
    expect(finalPath[0]).toEqual(finalPath[finalPath.length - 1]);
    expect(finalPath.slice(0, -1)).toEqual(expect.arrayContaining(points));
  });

  it("should return frames for visualization", async () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
    ];
    const result = await convexHullAlgorithm(points);

    expect(result.length).toBeGreaterThan(1);
    expect(result[0].paths[0].path).toHaveLength(1);
    expect(result[result.length - 1].paths[0].path).toHaveLength(
      points.length + 1
    );
  });
});
