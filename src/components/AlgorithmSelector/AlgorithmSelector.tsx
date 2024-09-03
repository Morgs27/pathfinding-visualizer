import Dropdown from "react-dropdown";

type AlgorithmSelectorProps = {
  algorithms: Algorithm[];
  currentAlgorithm: number;
  setCurrentAlgorithm: (algorithm: number) => void;
};

const AlgorithmSelector = ({
  algorithms,
  currentAlgorithm,
  setCurrentAlgorithm,
}: AlgorithmSelectorProps) => {
  return (
    <div className="option algorithm-option">
      <div className="optionTitle">ALGORITHM</div>
      <div className="optionContent">
        <Dropdown
          options={algorithms.map((algo) => algo.name)}
          onChange={(e) => {
            setCurrentAlgorithm(
              algorithms.findIndex((algo) => algo.name === e.value)
            );
          }}
          
          value={algorithms[currentAlgorithm].name}
          placeholder="Select an algorithm"
        />
      </div>
    </div>
  );
};

export default AlgorithmSelector;
