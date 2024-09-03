import Record from "../../types/Record";
import { Algorithms } from "../../config/Algorithms";
import { Theme } from "../../config/Themes";
import { FaRedo } from "react-icons/fa";
import { MdClear } from "react-icons/md";

type HistoryRowProps = {
  history: Record[];
  algorithms: Algorithms[];
  handleSetupReRunAlgorithm: (record: Record) => void;
  handleReRunAlgorithm: (record: Record) => void;
  setHistory: (history: Record[]) => void;
  theme: Theme;
  running: { current: boolean };
};

const HistoryRow = ({
  history,
  algorithms,
  handleSetupReRunAlgorithm,
  handleReRunAlgorithm,
  setHistory,
  theme,
  running,
}: HistoryRowProps) => {
  if (history.length < 1) return null;

  return (
    <div className="history-buttons">
      {history.map((record, index) => (
        <button
          key={index}
          onClick={() => {
            handleSetupReRunAlgorithm(record);
          }}
        >
          <div className="algorithm-name">
            {algorithms[record.algorithmIndex].name}
          </div>
          <div className="row">
            <div className="distance">{record.distance} px</div>
            <div className="points">
              {record.points.length}
              <img src={theme.locationDot} alt="point" className="point-icon" />
            </div>
          </div>
          {running.current == false && (
            <div className="run" onClick={() => handleReRunAlgorithm(record)}>
              Re-run <FaRedo className="icon"></FaRedo>
            </div>
          )}
        </button>
      ))}
      <button className="clear-history" onClick={() => setHistory([])}>
        Clear
        <MdClear />
      </button>
    </div>
  );
};

export default HistoryRow;
