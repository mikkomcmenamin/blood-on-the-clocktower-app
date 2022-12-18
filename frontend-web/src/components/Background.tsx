import bgVideo from "../assets/bgv.webm";
import './Background.scss';

type Props = {}

const Background: React.FC<Props> = () => {
  return (
    <div id="background-video">
      <video autoPlay muted loop>
        <source src={bgVideo} type="video/mp4"/>
      </video>
      <div id="background-video-overlay"></div>
    </div>
  )
};

export default Background;