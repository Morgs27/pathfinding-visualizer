import { LiaChartLineSolid } from "react-icons/lia";
import { LuMapPin, LuMapPinOff } from "react-icons/lu";
import { TbMap, TbMapOff } from "react-icons/tb";

type OptionsSelectorProps = {
  showExtraLines: boolean;
  setShowExtraLines: (show: boolean) => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  showPoints: boolean;
  setShowPoints: (show: boolean) => void;
};

const OptionsSelector = ({
  showExtraLines,
  setShowExtraLines,
  showMap,
  setShowMap,
  showPoints,
  setShowPoints,
}: OptionsSelectorProps) => {
  return (
    <div className="option points-settings">
      <div className="optionTitle">OPTIONS</div>
      <div className="optionContent">
        <div className="buttonGroup settings">
          <button
            onClick={() => setShowExtraLines(!showExtraLines)}
            data-active={showExtraLines ? "true" : "false"}
          >
            {showExtraLines ? <LiaChartLineSolid /> : <LiaChartLineSolid />}
          </button>
          <button
            onClick={() => setShowMap(!showMap)}
            data-active={showMap ? "true" : "false"}
          >
            {showMap ? <TbMap /> : <TbMapOff />}
          </button>
          <button
            onClick={() => setShowPoints(!showPoints)}
            data-active={showPoints ? "true" : "false"}
          >
            {showPoints ? <LuMapPin /> : <LuMapPinOff />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsSelector;
