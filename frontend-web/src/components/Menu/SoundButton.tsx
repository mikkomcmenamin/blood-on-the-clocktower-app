import React, { useContext } from "react";
import { AppContext } from "../../context";
import styled from "styled-components";
import SoundButtonOn from "../../assets/T_SoundButtonOn.png";
import SoundButtonOff from "../../assets/T_SoundButtonOff.png";

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
  const globals = useContext(AppContext);

  const handleClick = () => {
    globals.setValue({
      ...globals.value,
      soundVolume: globals.value.soundVolume > 0 ? 0 : 1,
    });
  };

  return (
    <Button
      isOn={globals.value.soundVolume > 0}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
    />
  );
};

export default SoundButton;
