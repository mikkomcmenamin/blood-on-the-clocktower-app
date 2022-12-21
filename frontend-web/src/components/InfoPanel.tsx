import React from 'react';
import { useWindowInnerWidth } from '../hooks';
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

  const width = useWindowInnerWidth();

  return width > 768 ? (<Panel>{text}</Panel>): null;
};

export default InfoPanel;