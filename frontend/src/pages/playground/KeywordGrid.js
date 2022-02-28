import React from "react";
import styled, { css } from "styled-components";
import { AppContext } from "../../contexts/AppContext";
import { fontFamilyReading } from "../../styles/Variants";

import KeywordCardGrid from "./keywordCards/KeywordCardGrid";
const KeywordGridStyled = styled.div`
  display: grid;
  color: white;

  grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
  margin-top: 10px;
  padding: 0.0em;
  ${fontFamilyReading};
  grid-gap 0.25em;

`;

// function getKeywordsToDisplay(
//   pgObject,
//   topSection,
//   favorites
// ) {
//   return topSection
//     ? favorites
//     : Object.keys(nowHitTwitterAllKeywordsAllNationalRanks.data).slice(0, 48);
// }

const KeywordGrid = () => {
  return (
    <AppContext.Consumer>
      {({ pgObjectShow }) => (
        <KeywordGridStyled>
          {Object.keys(pgObjectShow).map((index) => (
            <KeywordCardGrid key={index} index={index} />
          ))}
        </KeywordGridStyled>
      )}
    </AppContext.Consumer>
  );
};

export default KeywordGrid;
