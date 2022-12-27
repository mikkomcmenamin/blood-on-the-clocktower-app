import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context";

type SoundPlayerProps = {
  src: string;
  volume?: number;
  loop?: boolean;
};

const SoundPlayer: React.FC<SoundPlayerProps> = ({
  src,
  volume = 1,
  loop = true,
}) => {
  const globals = useContext(AppContext);
  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioElement.current;
    if (audio && globals.value.sound) {
      audio.volume = volume;
      audio.loop = loop;
      audio.src = src;
      audio.play();
    }
  }, [src, volume, loop]);

  return <audio ref={audioElement} />;
};

export default SoundPlayer;
