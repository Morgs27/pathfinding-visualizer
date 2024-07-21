import { Frame } from "../functions/runAlgorithm";
import Point from "./Point";

type Record = {
  id: string;
  algorithmIndex: number;
  distance: number;
  points: Point[];
  frames: Frame[];
};

export default Record;
