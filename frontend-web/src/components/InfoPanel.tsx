import React from "react";
import { useWindowInnerWidth } from "../hooks";
import styled from "styled-components";
import InfoPanelImage from "../assets/T_InfoPanel.png";

type InfoPanelPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const Panel = styled.div<{ position: InfoPanelPosition }>`
  background-image: url(${InfoPanelImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-width: 300px;
  position: fixed;
  margin: 2rem;
  padding: 1rem;
  text-align: center;
  padding: 20px 20px 30px 20px;

  ${(props) => {
    switch (props.position) {
      case "top-left":
        return `top: 0; left: 0;`;
      case "top-right":
        return `top: 0; right: 0;`;
      case "bottom-left":
        return `bottom: 0; left: 0;`;
      case "bottom-right":
        return `bottom: 0; right: 0;`;
    }
  }}
`;

type Props = {
  text: string;
  position: InfoPanelPosition;
  showOnMobile: boolean;
};

const InfoPanel: React.FC<Props> = ({ text, position, showOnMobile }) => {
  const width = useWindowInnerWidth();

  return showOnMobile || width > 768 ? (
    <Panel position={position}>{text}</Panel>
  ) : null;
};

export default InfoPanel;
