import React from "react";
import styled from "styled-components";
import SoundButtonOn from "../../assets/T_SoundButtonOn.png";
import SoundButtonOff from "../../assets/T_SoundButtonOff.png";
import { useAtom } from "jotai";
import { setGlobalVolume } from "../soundManager";
import { soundVolumeAtom } from "../../atoms/settingsAtoms";

type ButtonProps = {
  isOn: boolean;
};

const Button = styled.button<ButtonProps>`
  background: url(${(props) => (props.isOn ? SoundButtonOn : SoundButtonOff)})
    no-repeat;
  background-size: contain;
  width: 50px;
  height: 50px;
`;

const SoundButton: React.FC = () => {
  const [volume, setVolume] = useAtom(soundVolumeAtom);

  setGlobalVolume(volume);

  const handleClick = () => {
    setVolume(volume > 0 ? 0 : 1);
  };

  return (
    <Button
      isOn={volume > 0}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
    />
  );
};

export default SoundButton;
