import { Dispatch, SetStateAction } from "react";
import point from "../types/Point";
import dimensions from "../types/Dimensions";

interface PointsFunctions {
  addPoint: (x: number, y: number) => void;
  addPoints: (number: number) => void;
  checkDuplicatePoints: () => void;
  createAddPointClick: (
    modalOpen: boolean,
    margins: any,
    toggleMenu: () => void
  ) => (e: any) => void;
}

export function usePointsFunctions(
  setPoints: Dispatch<SetStateAction<point[]>>,
  screenDimensions: dimensions,
  margins: any
): PointsFunctions {
  let addingPoint = false;

  function addPoint(x: number, y: number) {
    setPoints((points) => [
      ...points.map((point) => ({ ...point, solved: false })),
      { x, y, solved: false },
    ]);
  }

  function addPoints(number: number) {
    setPoints((points) => [
      ...points,
      ...Array(number)
        .fill(undefined)
        .map(() => ({
          x:
            Math.random() *
              ((screenDimensions.width || 0) - margins.left - margins.right) +
            margins.left,
          y:
            Math.random() *
              ((screenDimensions.height || 0) - margins.top - margins.bottom) +
            margins.top,
          solved: false,
        })),
    ]);
    checkDuplicatePoints();
  }

  function checkDuplicatePoints() {
    setPoints((points) => [
      ...new Map(points.map((point) => [point.x, point])).values(),
    ]);
  }

  function createAddPointClick(
    modalOpen: boolean,
    margins: any,
    toggleMenu: () => void
  ) {
    return (e: any) => {
      if (modalOpen) return;

      if (
        !(e.target as Element).closest(".header") &&
        !(e.target as Element).closest(".button") &&
        !(e.target as Element).closest(".pageCover") &&
        !(e.target as Element).closest(".tutorialModal") &&
        !(e.target as Element).closest(".stats")
      ) {
        if (!addingPoint) {
          addingPoint = true;

          if (e.offsetY > margins.top) {
            addPoint(e.offsetX, e.offsetY);
          }

          toggleMenu();

          setTimeout(() => {
            addingPoint = false;
          }, 300);
        }
      }
    };
  }

  return { addPoint, addPoints, checkDuplicatePoints, createAddPointClick };
}
