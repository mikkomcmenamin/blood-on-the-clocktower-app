import React, { useEffect, useRef } from 'react';

type SoundPlayerProps = {
  src: string;
  volume?: number;
  loop?: boolean;
}

const SoundPlayer: React.FC<SoundPlayerProps> = ( {src, volume = 1, loop = true} ) => {

  const audioElement = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioElement.current;
    if(audio){
      audio.volume = volume;
      audio.loop = loop;
      audio.src = src;
      audio.play();
    }
  }, [src, volume, loop]);

  return <audio ref={audioElement} />;
};

export default SoundPlayer;