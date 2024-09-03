import { Theme } from "../../config/Themes";
import { DynamicModal, Page } from "../DynamicModal/DynamicModal";

type TutorialProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  theme: Theme;
};

const Tutorial = ({ open, setOpen, theme }: TutorialProps) => {
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
      <Page>b content</Page>
      <Page>c content</Page>
    </DynamicModal>
  );
};

export default Tutorial;
