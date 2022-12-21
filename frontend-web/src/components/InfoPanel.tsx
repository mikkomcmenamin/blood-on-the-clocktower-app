import React from 'react';
import { useWindowInnerWidth } from '../hooks';
import styled from "styled-components";
import InfoPanelImage from "../assets/T_InfoPanel.png";

const Panel = styled.div`
  background-image: url(${InfoPanelImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-width: 300px;
  position: fixed;
  margin: 2rem;
  top: 0;
  right: 0;
  padding: 1rem;
  text-align: center;
  padding: 20px 20px 30px 20px;
`;

type Props = {
  text: string;
}

const InfoPanel: React.FC<Props> = ({ text }) => {

  const width = useWindowInnerWidth();

  return width > 768 ? (<Panel>{text}</Panel>): null;
};

export default InfoPanel;