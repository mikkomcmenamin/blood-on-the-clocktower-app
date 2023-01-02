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
  position: fixed;
  margin: 15px;
  bottom: 17%;
  left: 0;
  width: 50px;
  height: 50px;

  @media (min-width: 768px) {
    bottom: 60px;
    left: 0;
  }
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
