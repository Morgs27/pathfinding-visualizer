import "./LoadingText.css";
import { RxCross1 } from "react-icons/rx";

interface LoadingTextProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  dots?: boolean;
}

export function LoadingText({ text, dots, state, setState }: LoadingTextProps) {
  if (!state) return null;

  return (
    <div className="loading-container">
      <div className="loading-close" onClick={() => window.location.reload()}>
        <RxCross1 />
      </div>
      <section className="loading-data">
        <h2 className="loading-text text-center text-uppercase">
          {text.split("").map((char, index) => (
            <span key={index} className="char">
              {char}
            </span>
          ))}
          {dots &&
            "...".split("").map((dot, index) => (
              <span key={`dot-${index}`} className="char white">
                {dot}
              </span>
            ))}
        </h2>
      </section>
    </div>
  );
}
