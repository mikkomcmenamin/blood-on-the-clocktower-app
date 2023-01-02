import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context";
import styled from "styled-components";
import { keyframes } from "styled-components";

const Video = styled.video<{ fadeIn: boolean }>`
  position: fixed;
  pointer-events: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: ${(props) => (props.fadeIn ? "black" : "transparent")};
  animation: ${(props) =>
    props.fadeIn
      ? keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `
      : keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  `};
  animation-duration: 3s;
`;

type VideoAnimationProps = {
  src: string;
};

const VideoAnimation: React.FC<VideoAnimationProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isEnded, setIsEnded] = useState(false);
  const [hide, setHide] = useState(false);

  const globals = useContext(AppContext);

  useEffect(() => {
    if (!globals.value.video) {
      setHide(true);
      return;
    }

    if (videoRef.current) {
      setTimeout(() => {
        videoRef.current?.play();
      }, 2000);
    }
  }, [videoRef, globals.value.video]);

  const handleEnded = () => {
    setIsEnded(true);
  };

  useEffect(() => {
    if (isEnded) {
      setTimeout(() => {
        setHide(true);
      }, 3000);
    }
  }, [isEnded]);

  // playsInline is required for the video to play on iOS

  return hide ? null : (
    <Video fadeIn={!isEnded} ref={videoRef} playsInline onEnded={handleEnded}>
      <source src={src} type="video/mp4"></source>
    </Video>
  );
};

export default VideoAnimation;
