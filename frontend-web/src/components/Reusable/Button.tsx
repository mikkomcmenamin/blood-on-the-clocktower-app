import React from "react";
import styled from "styled-components";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

const StyledButton = styled.button`
  background-color: hsl(32, 12%, 19%);
  color: white;
  font-size: 16px;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 4px;
  &:hover {
    background-color: hsl(32, 14%, 30%);
  }
`;

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default Button;
