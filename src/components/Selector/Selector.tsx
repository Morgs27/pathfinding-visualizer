type SelectorProps = {
  show?: boolean;
  title: string;
  options: {
    name: string;
    value: any;
  }[];
  value: any;
  setOption: (value: any) => void;
  clear?: boolean;
  customContent?: React.ReactNode;
};

const Selector = ({
  show = true,
  title,
  options,
  value,
  setOption,
  clear,
  customContent,
}: SelectorProps) => {
  if (!show) return null;

  return (
    <div className="option">
      <div className="optionTitle">{title}</div>
      <div className="optionContent">
        {customContent ? (
          customContent
        ) : (
          <div className="buttonGroup">
            {options.map((option) => (
              <button
                key={option.value}
                data-active={value === option.value ? "true" : "false"}
                onClick={() => setOption(option.value)}
              >
                {option.name}
              </button>
            ))}
            {clear && (
              <button
                onClick={() => {
                  setOption(0);
                }}
                style={{
                  borderColor: "rgba(255,255,255,0.6)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Selector;
