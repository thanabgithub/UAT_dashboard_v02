import React from "react";
import styled from "styled-components";
import { AppContext } from "../../contexts/AppContext";
import { fontFamilyReading } from "../../styles/Variants";
import { SelectableTile } from "../../components/containers/Tile";

const KeywordGridStyled = styled.div`
  display: grid;
  color: white;

  grid-template-columns: repeat(5, 1fr);
  margin-top: 10px;
  padding: 0px;
  ${fontFamilyReading};
  grid-gap 15px
`;

function getKeywordsToDisplay(nowHitKeywordListData) {
  return nowHitKeywordListData.keywordList.slice(0, 40);
}

const KeywordGrid = () => {
  return (
    <AppContext.Consumer>
      {({ nowHitKeywordListData }) => (
        <KeywordGridStyled>
          {getKeywordsToDisplay(nowHitKeywordListData).map((keyword) => (
            <SelectableTile>{keyword}</SelectableTile>
          ))}
        </KeywordGridStyled>
      )}
    </AppContext.Consumer>
  );
};

export default KeywordGrid;

// {nowHitKeywordListData.keywordList.length}
