import React from "react";
import styled, { css } from "styled-components";
import { AppContext } from "../../../contexts/AppContext";
const Logo = styled.div`
  font-family: Orbitron;
  font-size: 1.75em;
  font-weight: 900;
  color: palevioletred;
`;
// #fe9ea8
const ControlButtonStyle = styled.div`
  cursor: pointer;

  color: palevioletred;
  ${(props) =>
    props.active &&
    css`
      font-weight: 500;
      color: white;
      text-shadow: #fc0 1px 0 10px;
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
  grid-template-columns: 180px auto 120px 120px;
  margin-bottom: 40px; ;
`;

const AppBar = () => {
  return (
    <BarStyle>
      <Logo>NowHit</Logo>
      <div />
      <ControlButton name="ダッシュボード" />
      <ControlButton name="設定" />
    </BarStyle>
  );
};

export default AppBar;
