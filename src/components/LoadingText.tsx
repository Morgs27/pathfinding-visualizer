import { useEffect, useRef, useState } from "react";
import "./LoadingText.css";
import { RxCross1 } from "react-icons/rx";

interface LoadingTextProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LoadingText({ state, setState }: LoadingTextProps) {
  if (state) {
    return (
      <div className="loading-container">
        <div className="loading-close" onClick={() => window.location.reload()}>
          <RxCross1 />
        </div>
        <section className="loading-data">
          <h2 className="loading-text text-center text-uppercase">
            <span className="char">c</span>
            <span className="char">a</span>
            <span className="char">l</span>
            <span className="char">c</span>
            <span className="char">u</span>
            <span className="char">l</span>
            <span className="char">a</span>
            <span className="char">t</span>
            <span className="char">i</span>
            <span className="char">n</span>
            <span className="char">g</span>
            <span className="char white">.</span>
            <span className="char white">.</span>
            <span className="char white">.</span>
          </h2>
        </section>
      </div>
    );
  } else {
    return <></>;
  }
}
