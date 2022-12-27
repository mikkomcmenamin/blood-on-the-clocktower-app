import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { keyframes } from "styled-components";

const VideoContainer = styled.div<{ fadeIn: boolean }>`
  position: fixed;
  pointer-events: none;
  width: 100%;
  height: 100%;
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

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

type VideoAnimationProps = {
  src: string;
  play: boolean;
};

const VideoAnimation: React.FC<VideoAnimationProps> = ({ src, play }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isEnded, setIsEnded] = useState(false);
  const [hide, setHide] = useState(false);

  console.log({ play, isEnded });

  useEffect(() => {
    if (videoRef.current) {
      setTimeout(() => {
        videoRef.current?.play();
      }, 2000);
    }
  }, [videoRef.current]);

  const handleEnded = () => {
    setIsEnded(true);
    console.log("video ended");
  };

  useEffect(() => {
    if (isEnded) {
      setTimeout(() => {
        setHide(true);
      }, 3000);
    }
  }, [isEnded]);

  return hide ? null : (
    <VideoContainer fadeIn={!isEnded}>
      <Video ref={videoRef} onEnded={handleEnded}>
        <source src={src} type="video/mp4"></source>
      </Video>
    </VideoContainer>
  );
};

export default VideoAnimation;
