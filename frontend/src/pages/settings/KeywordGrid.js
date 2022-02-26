import React from "react";
import styled from "styled-components";
import { AppContext } from "../../contexts/AppContext";
import { fontFamilyReading } from "../../styles/Variants";

import KeywordCardGrid from "./keywordCards/KeywordCardGrid";
const KeywordGridStyled = styled.div`
  display: grid;
  color: white;

  grid-template-columns: repeat(4, 1fr);
  margin-top: 10px;
  padding: 0px;
  ${fontFamilyReading};
  grid-gap 15px
`;

function getKeywordsToDisplay(
  nowHitTwitterAllKeywordsAllNationalRanks,
  topSection
) {
  return Object.keys(nowHitTwitterAllKeywordsAllNationalRanks.data).slice(
    0,
    topSection ? 4 : 20
  );
}

const KeywordGrid = ({ topSection }) => {
  return (
    <AppContext.Consumer>
      {({ nowHitTwitterAllKeywordsAllNationalRanks }) => (
        <KeywordGridStyled>
          {getKeywordsToDisplay(
            nowHitTwitterAllKeywordsAllNationalRanks,
            topSection
          ).map((keyword) => (
            <KeywordCardGrid keyword={keyword} topSection={topSection} />
          ))}
        </KeywordGridStyled>
      )}
    </AppContext.Consumer>
  );
};

export default KeywordGrid;

// {nowHitKeywordListData.keywordList.length}
