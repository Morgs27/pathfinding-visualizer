import point from "./Point";

export type Edge = {
    point1: point;
    point1Index?: number;
    point2: point;
    point2Index?: number;
    distance: number;
    added?: boolean;
};

export default Edge;