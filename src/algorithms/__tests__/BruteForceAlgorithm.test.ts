import bruteForceAlgorithm from "../BruteForce/BruteForceAlgorithm";
import { jest, expect, it, describe, test } from "@jest/globals";

describe("BruteForceAlgorithm", () => {
  it("does something", () => {
    expect(1).toBe(1);
  });
  // test("should return correct result for a single point", async () => {
  //   const input = [{ x: 0, y: 0 }];
  //   const [solution, permutations] = await bruteForceAlgorithm(input);
  //   expect(solution).toEqual([
  //     { x: 0, y: 0 },
  //     { x: 0, y: 0 },
  //   ]);
  //   expect(permutations.length).toBe(1);
  // });
  // test("should return correct result for two points", async () => {
  //   const input = [
  //     { x: 0, y: 0 },
  //     { x: 1, y: 1 },
  //   ];
  //   const [solution, permutations] = await bruteForceAlgorithm(input);
  //   // expect(solution).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  //   expect(permutations.length).toBe(2);
  // });
  // test("should return correct result for three points", async () => {
  //   const input = [
  //     { x: 0, y: 0 },
  //     { x: 1, y: 1 },
  //     { x: 2, y: 2 },
  //   ];
  //   const [solution, permutations] = await bruteForceAlgorithm(input);
  //   // expect(solution).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }]);
  //   expect(permutations.length).toBe(6);
  // });
  // test("should return correct result for four points", async () => {
  //   const input = [
  //     { x: 0, y: 0 },
  //     { x: 1, y: 1 },
  //     { x: 2, y: 2 },
  //     { x: 3, y: 3 },
  //   ];
  //   const [solution, permutations] = await bruteForceAlgorithm(input);
  //   // expect(solution).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }]);
  //   expect(permutations.length).toBe(24);
  // });
});
