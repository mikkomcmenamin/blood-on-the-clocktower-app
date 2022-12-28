import bgVideo from "../assets/bgv.webm";
import "./Background.scss";

type Props = {
  phase: "day" | "night";
};

const Background: React.FC<Props> = ({ phase }) => {
  return (
    <div id="background-video">
      <video autoPlay muted loop>
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div id="background-video-overlay" className={`phase-${phase}`}></div>
    </div>
  );
};

export default Background;
