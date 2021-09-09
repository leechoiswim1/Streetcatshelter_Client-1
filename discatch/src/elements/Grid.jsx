// LIBRARY
import React from "react";
import styled from "styled-components";

// STYLE
import { borderBox } from "../shared/style";

const Grid = ({ children, clickEvent, ...props }) => {
  return (
    <GridStyle onClick={clickEvent} {...props}>
      {children}
    </GridStyle>
  );
};

Grid.defaultProps = {
  opacity: 1,
  addstyle: () => {},
  clickEvent: () => {},
  width: "100%",
  height: "100%",
};

const GridStyle = styled.div`
  flex-direction: ${(props) => props.flexDirection};
  cursor: ${(props) => props.cursor};
  width: ${(props) => props.width};
  display: ${(props) => props.display};
  height: ${(props) => props.height};
  margin: ${(props) => props.margin};
  border: ${(props) => props.border};
  justify-content: ${(props) => props.justifyContent};
  background: ${(props) =>
    props.bgColor &&
    `rgba(${props.theme.palette[props.bgColor]}, ${props.opacity})`};
  background: ${(props) => props.background};
  color: ${(props) =>
    props.color &&
    `rgba(${props.theme.palette[props.color]}, ${props.opacity})`};
  overflow: ${(props) => props.overflow};
  ${(props) => borderBox(props.radius, props.padding)};
  ${(props) => props.addstyle()};
`;

export default Grid;
