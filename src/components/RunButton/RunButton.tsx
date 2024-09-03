import { BsFillStopCircleFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";

type RunButtonProps = {
  running: any;
  setRunningState: (running: boolean) => void;
  handleAlgorithmSetup: () => void;
  bottom?: boolean;
};

const RunButton = ({
  running,
  setRunningState,
  handleAlgorithmSetup,
  bottom,
}: RunButtonProps) => {
  if (bottom) {
    return (
      <div className="bottom-run">
        <button
          onClick={() => handleAlgorithmSetup()}
          disabled={running.current}
          className={`${running.current ? "disabled" : ""}`}
        >
          Run <FaPlay className="icon"></FaPlay>
        </button>
        <button
          onClick={() => {
            running.current = false;
            setRunningState(false);
          }}
          disabled={!running.current}
          className={`${!running.current ? "disabled" : ""}`}
        >
          Stop <BsFillStopCircleFill className="icon"></BsFillStopCircleFill>
        </button>
      </div>
    );
  } else {
    return (
      <div className="option run-option">
        <div className="optionTitle">RUN</div>
        <div className="optionContent">
          <div className="buttonGroup">
            <button
              onClick={() => handleAlgorithmSetup()}
              disabled={running.current!}
              className={`${running.current ? "disabled" : ""}`}
            >
              Run <FaPlay className="icon"></FaPlay>
            </button>
            <button
              onClick={() => {
                running.current = false;
                setRunningState(false);
              }}
              disabled={!running.current}
              className={`${!running.current ? "disabled" : ""}`}
            >
              Stop{" "}
              <BsFillStopCircleFill className="icon"></BsFillStopCircleFill>
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default RunButton;
