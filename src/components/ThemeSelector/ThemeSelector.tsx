import { Theme } from "../../config/Themes";

type ThemeSelectorProps = {
  themes: Theme[];
  theme: Theme;
  setTheme: (theme: Theme) => void;
  showMap: boolean;
};

const ThemeSelector = ({
  themes,
  theme,
  setTheme,
  showMap,
}: ThemeSelectorProps) => {
  return (
    <div className="option">
      <div className="optionTitle">THEME</div>
      <div className="optionContent">
        <div className="buttonGroup themes">
          {themes.map((themeOption, index) => (
            <button
              key={index}
              data-active={theme === themeOption ? "true" : "false"}
              onClick={() => setTheme(themeOption)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = themeOption.colour)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)")
              }
              style={{
                borderColor: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {showMap ? (
                <img
                  src={themeOption.imagePlainUrl}
                  alt={themeOption.name}
                  className="fadeIn"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 0.2,
                    backgroundColor: themeOption.colour,
                  }}
                ></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
