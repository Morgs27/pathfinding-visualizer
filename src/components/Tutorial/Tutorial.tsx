import { Theme } from "../../config/Themes";
import { DynamicModal, Page } from "../DynamicModal/DynamicModal";
import { GiPathDistance } from "react-icons/gi";
import "./Tutorial.css";
import { BlockMath, InlineMath } from "react-katex";
import { SiThealgorithms } from "react-icons/si";
import { useEffect, useRef } from "react";

type TutorialProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  theme: Theme;
};

const Tutorial = ({ open, setOpen, theme }: TutorialProps) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            video.play();
          } else {
            const video = entry.target as HTMLVideoElement;
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

  return (
    <DynamicModal state={open} setState={setOpen}>
      <Page>
        <h3>Welcome to TSP Visualizer</h3>
        <p>
          <i>TSP - Traveling Salesman Problem</i>
        </p>
        <img
          className="fadeIn"
          height={150}
          src={theme.locationDot}
          alt={theme.name}
          style={{ animation: "fadeIn 1s ease-in-out", height: 150 }}
        />
        <p>
          This short tutorial will walk you through all the features of this
          application.
        </p>
      </Page>
      <Page>
        <h3 className="underline">Understanding the Problem</h3>
        <p>
          The TSP describes a scenario where a salesman is required to travel
          between <InlineMath>n</InlineMath> cities. He wishes to travel to all
          locations exactly once and he must finish at his starting point. The
          order in which the cities are visited is not important but he wishes
          to minimize the distance traveled.
        </p>
        <GiPathDistance size={24} />
        <ul>
          <li>
            The TSP problem is NP-hard meaning there is no known efficient
            algorithm that can solve it
          </li>
        </ul>
      </Page>
      <Page>
        <h3 className="underline">Algorithms</h3>
        <p>
          There are a number of algorithms that can be used to find optimal
          tours, but none are feasible for large examples since they all grow
          exponentially. We can get down to polynomial growth if we settle for
          near optimal tours by using approximation algorithms and heuristics.
        </p>
        <SiThealgorithms />
        {/* <img src={"/algorithm.png"} alt="the algorithms" /> */}
        <ul>
          <p>
            Most of the algorithms used in this app are described in{" "}
            <a
              href="http://160592857366.free.fr/joe/ebooks/ShareData/Heuristics%20for%20the%20Traveling%20Salesman%20Problem%20By%20Christian%20Nillson.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Heuristics for the Traveling Salesman Problem
            </a>{" "}
            by Christian Nilsson.
          </p>
        </ul>
      </Page>

      <Page>
        <h3 className="underline">Using the App</h3>

        <div style={{ height: "calc(100% - 24px)", overflow: "hidden" }}>
          <video
            ref={(el) => (videoRefs.current[0] = el)}
            loop
            muted
            playsInline
            preload="none"
            className="tutorial-video"
            style={{ marginTop: "-24px" }}
          >
            <source src="/TutorialVideos/tutorial.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </Page>
    </DynamicModal>
  );
};

export default Tutorial;
