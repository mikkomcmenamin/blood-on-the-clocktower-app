import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { keyframes } from "styled-components";
import { useAtom } from "jotai";
import { videoAtom } from "../settingsAtoms";

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
  const [isEnding, setIsEnding] = useState(false);
  const [hide, setHide] = useState(false);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [video] = useAtom(videoAtom);

  useEffect(() => {
    if (!video) {
      setHide(true);
      return;
    }

    if (!videoRef.current) {
      return;
    }

    const current = videoRef.current;
    const ready = () => {
      setMetadataLoaded(true);
    };
    current.addEventListener("loadedmetadata", ready);

    return () => {
      current.removeEventListener("loadedmetadata", ready);
    };
  }, [videoRef, video, setMetadataLoaded]);

  useEffect(() => {
    if (videoRef.current && metadataLoaded) {
      videoRef.current.play();
      setMetadataLoaded(false);
      setTimeout(() => {
        setIsEnding(true);
      }, (videoRef.current.duration - 3) * 1000);
    }
  }, [metadataLoaded, videoRef]);

  useEffect(() => {
    if (isEnding) {
      setTimeout(() => {
        setHide(true);
      }, 2500);
    }
  }, [isEnding, setHide]);

  // playsInline is required for the video to play on iOS

  return hide ? null : (
    <Video fadeIn={!isEnding} ref={videoRef} playsInline>
      <source src={src} type="video/webm"></source>
    </Video>
  );
};

export default VideoAnimation;
