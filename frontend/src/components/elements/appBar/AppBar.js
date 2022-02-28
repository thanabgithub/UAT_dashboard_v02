import React from "react";
import styled, { css } from "styled-components";
import { AppContext } from "../../../contexts/AppContext";
import RegionSelectButtons from "../../../pages/playground/filter/RegionSelectButtons";

const Logo = styled.div`
  justify-self: self-start;
  font-size: 1.75em;
  font-weight: 900;
  color: #f95335;
  text-shadow: 1px 1px 2px #2c241c;
`;
// #fe9ea8
const ControlButtonStyle = styled.div`
  cursor: pointer;
  padding-right: 0.75em;
  font-size: 0.75em;
  color: #f95335;
  font-weight: 900;
  display: flex;
  justify-self: self-end;
  ${(props) =>
    props.active &&
    css`
      color: #50a3a4;
      text-shadow: #fc0 0px 0px 1px 1px;
    `}
`;

/* it consume information here and provide to App.js then it ends up provide
      variable currentPage to all buttons. */

const ControlButton = ({ name, active }) => {
  return (
    <AppContext.Consumer>
      {({ currentPage, setCurrentPage }) => (
        <ControlButtonStyle
          active={currentPage === name}
          onClick={() => setCurrentPage(name)}
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
  display: flex;
  margin-bottom: 2em;
  align-items: center;
  justify-content: space-between;
`;

const MeanuLayout = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0;
`;

const AppBar = () => {
  return (
    <BarStyle>
      <Logo>NowHit</Logo>
      <MeanuLayout>
        <ControlButton name="Monitor" />
        <ControlButton name="Research" />
        <ControlButton name="Playground" />
      </MeanuLayout>
    </BarStyle>
  );
};

export default AppBar;
