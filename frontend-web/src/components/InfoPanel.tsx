import React from 'react';
import styled from "styled-components";

const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
`;

type Props = {
  text: string;
}

const InfoPanel: React.FC<Props> = ({ text }) => {

  const isDesktop = window.innerWidth > 768; //probably no need to react to screen size changes

  return isDesktop ? (<Panel>{text}</Panel>): null;
};

export default InfoPanel;