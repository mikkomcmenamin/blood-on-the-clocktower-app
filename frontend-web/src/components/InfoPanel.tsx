import React from "react";
import styled from "styled-components";
import InfoPanelImage from "../assets/T_InfoPanel.png";

type InfoPanelPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-right-2";

const Panel = styled.div<{ position: InfoPanelPosition }>`
  background-image: url(${InfoPanelImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  text-align: center;
  padding: 20px 20px 30px 20px;
  width: min(100%, 300px);

  @media (min-width: 768px) {
    position: fixed;
    margin: 2rem;
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
          case "top-right-2":
            return `top: 100px; right: 0;`;
      }
    }}
  }
`;

type Props = {
  children: React.ReactNode;
  position: InfoPanelPosition;
};

const InfoPanel: React.FC<Props> = ({ children, position }) => {
  return <Panel position={position}>{children}</Panel>;
};

export default InfoPanel;
