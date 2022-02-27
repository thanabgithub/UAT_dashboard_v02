import React from "react";
import styled, { css } from "styled-components";
import { AppContext } from "../../../contexts/AppContext";
import { fontFamilyReading, fontSize2 } from "../../../styles/Variants";

import { brightGlowBoxShadowThin } from "../../../styles/Variants";
export const RegionTile = styled.div`

  background-color: #ea9ebb;
  color: #3f3647;
  font-weight: 600;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  border-radius: 0.25em;
  width: 100%;


  display: felx;
  align-items: center;
  justify-content: center;
  margin:0;
  ${fontSize2};
  &:hover{cursor: pointer; ${brightGlowBoxShadowThin}};
  ${(props) =>
    props.active === true &&
    css`
      background-color: #7d6b8d;
      font-weight: 200;
      color: white;
    `}
}`;

/* it consume information here and provide to App.js then it ends up provide
      variable currentPage to all buttons. */

const handleWrapper = (handleRegionSelect, e, region, isInUnshowns) => {
  e.preventDefault();
  let res = isInUnshowns(region);
  if (res) {
    console.log("handleWrapper " + region + res);
  }
  return handleRegionSelect(region);
};

const ControlButton = ({ region, isInUnshowns }) => {
  return (
    <AppContext.Consumer>
      {({ handleRegionSelect, isInUnshowns }) => (
        <RegionTile
          active={isInUnshowns(region)}
          onClick={(e) =>
            handleWrapper(handleRegionSelect, e, region, isInUnshowns)
          }
        >
          {region}
        </RegionTile>
      )}
    </AppContext.Consumer>
  );
};

const RegionButtonGrid = styled.div`
  display: grid;
  color: white;
  margin-top: 1em;
  grid-template-columns: repeat(auto-fill, minmax(4em, 1fr));

  padding: 0px;

  grid-gap 0.5em
`;

const RegionSelectButtons = () => {
  return (
    <RegionButtonGrid>
      <ControlButton region="沖縄" />
      <ControlButton region="東京" />
      <ControlButton region="福岡" />
      <ControlButton region="広島" />

      <ControlButton region="神戸" />
      <ControlButton region="京都" />
      <ControlButton region="大阪" />
      <ControlButton region="名古屋" />
      <ControlButton region="高松" />

      <ControlButton region="浜松" />
      <ControlButton region="仙台" />
      <ControlButton region="札幌" />
    </RegionButtonGrid>
  );
};

export default RegionSelectButtons;
