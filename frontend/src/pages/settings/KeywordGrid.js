import React from "react";
import styled from "styled-components";
import { AppContext } from "../../contexts/AppContext";
import { fontFamilyReading } from "../../styles/Variants";

import KeywordCardGrid from "./keywordCards/KeywordCardGrid";
const KeywordGridStyled = styled.div`
  display: grid;
  color: white;

  grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  margin-top: 10px;
  padding: 0px;
  ${fontFamilyReading};
  grid-gap 15px
`;

function getKeywordsToDisplay(
  nowHitTwitterAllKeywordsAllNationalRanks,
  topSection,
  favorites
) {
  return topSection
    ? favorites
    : Object.keys(nowHitTwitterAllKeywordsAllNationalRanks.data).slice(0, 48);
}

const KeywordGrid = ({ topSection }) => {
  return (
    <AppContext.Consumer>
      {({ nowHitTwitterAllKeywordsAllNationalRanks, favorites }) => (
        <KeywordGridStyled>
          {getKeywordsToDisplay(
            nowHitTwitterAllKeywordsAllNationalRanks,
            topSection,
            favorites
          ).map((keyword) => (
            <KeywordCardGrid
              key={keyword}
              keyword={keyword}
              topSection={topSection}
            />
          ))}
        </KeywordGridStyled>
      )}
    </AppContext.Consumer>
  );
};

export default KeywordGrid;
