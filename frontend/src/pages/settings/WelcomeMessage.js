import React from "react";
import { AppContext } from "../../contexts/AppContext";
import styled from "styled-components";
const ThinFont = styled.div`
  font-family: Orbitron;

  font-weight: 300;
`;

export default function Welcome(props) {
  return (
    <AppContext.Consumer>
      {({ isFirstVisit }) =>
        isFirstVisit ? (
          <div>
            <h2>Welcome to NowHit Research</h2>
            <ThinFont>Please select your interest keywords to proceed</ThinFont>
          </div>
        ) : null
      }
    </AppContext.Consumer>
  );
}
