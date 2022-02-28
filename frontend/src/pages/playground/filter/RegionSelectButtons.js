import React from "react";
import styled, { css } from "styled-components";
import { AppContext } from "../../../contexts/AppContext";
import { fontFamilyReading, fontSize2 } from "../../../styles/Variants";

import { brightGlowBoxShadowThin } from "../../../styles/Variants";
export const RegionTile = styled.div`

  background-color: #FCAF38;
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

const handleWrapper = (
  handleRegionSelect,
  e,
  region,
  isInUnshowns,
  UnshownRegionsStatus
) => {
  e.preventDefault();
  let res = isInUnshowns(region);
  console.log("UnshownRegionsStatus!!!!!!!!!!!!!!!!!!!!!");
  console.log(UnshownRegionsStatus);
  if (res) {
    console.log("handleWrapper " + region + res);
  }
  return handleRegionSelect(region);
};

const ControlButton = ({ region, isInUnshowns, UnshownRegionsStatus }) => {
  return (
    <AppContext.Consumer>
      {({ handleRegionSelect, isInUnshowns }) => (
        <RegionTile
          active={isInUnshowns(region)}
          onClick={(e) =>
            handleWrapper(
              handleRegionSelect,
              e,
              region,
              isInUnshowns,
              UnshownRegionsStatus
            )
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
    <AppContext.Consumer>
      {({ uniqueRegion }) => (
        <RegionButtonGrid>
          {uniqueRegion.map((element, key) => (
            <ControlButton key={key} region={element} />
          ))}
        </RegionButtonGrid>
      )}
    </AppContext.Consumer>
  );
};

export default RegionSelectButtons;
