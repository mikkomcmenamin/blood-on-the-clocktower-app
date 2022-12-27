import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {keyframes} from 'styled-components'

const VideoContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
`

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const FadeOutKeyframes = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const FadeInKeyframes = keyframes`
   from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

const Fade = styled.div<{ fadeIn: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  background-color: #000;
  transition: opacity 1s linear;
  animation-name: ${props => (props.fadeIn ? FadeInKeyframes : FadeOutKeyframes)};
  animation-duration: 1s;
  animation-fill-mode: ${props => (props.fadeIn ? "forward" : "backwards")};
`;

type VideoAnimationProps = {
  src: string;
  play: boolean;
}

const VideoAnimation: React.FC<VideoAnimationProps> = ({src, play}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFadeIn, setIsFadeIn] = useState(true);

  useEffect(() => {
    if (play && videoRef.current) {
      handlePlay();
    } else if (videoRef.current) {
      //handleStop();
    }
  }, [play])

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }

  //is handleStop really needed?
//  const handleStop = () => {
//    if(videoRef.current){
//      videoRef.current.pause();
//      setIsPlaying(false);
//    }
//  }

  const handleEnded = () => {
    setIsFadeIn(false);
    //setIsPlaying(false);
    console.log("video ended");
  }

  return (
    <VideoContainer>
      <Video ref={videoRef} onEnded={handleEnded}>
        <source src={src} type="video/mp4"></source>
      </Video>
      {isPlaying && <Fade fadeIn={isFadeIn}/>}
    </VideoContainer>)
}

export default VideoAnimation;