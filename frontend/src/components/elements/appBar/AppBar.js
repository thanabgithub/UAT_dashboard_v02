import React from "react";
import styled, { css } from "styled-components";
import { AppContext } from "../../../contexts/AppContext";

const Logo = styled.div`
  justify-self: self-start;
  font-size: 1.75em;
  font-weight: 900;
  color: palevioletred;
`;
// #fe9ea8
const ControlButtonStyle = styled.div`
  cursor: pointer;
  padding-right: 0.75em;
  font-size: 0.75em;
  color: palevioletred;
  display: flex;
  justify-self: self-end;
  ${(props) =>
    props.active &&
    css`
      color: white;
      text-shadow: #fc0 0px 0px 1px 1px;
    `}
`;

/* it consume information here and provide to App.js then it ends up provide
      variable page to all buttons. */

const ControlButton = ({ name, active }) => {
  return (
    <AppContext.Consumer>
      {({ page, setPage }) => (
        <ControlButtonStyle
          active={page === name}
          onClick={() => setPage(name)}
        >
          {setProperCase(name)}
        </ControlButtonStyle>
      )}
    </AppContext.Consumer>
  );
};

const setProperCase = (lower) => {
  return lower.charAt(0).toUpperCase() + lower.substr(1);
};

const BarStyle = styled.div`
  display: grid;
  grid-template-columns: 7em auto 6em 6em;
  margin-bottom: 2em;
  align-items: center;
`;

const AppBar = () => {
  return (
    <BarStyle>
      <Logo>NowHit</Logo>
      <div />
      <ControlButton name="Research" />
      <ControlButton name="Settings" />
    </BarStyle>
  );
};

export default AppBar;
