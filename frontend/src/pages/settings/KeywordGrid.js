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

const KeywordGrid = () => {
  return (
    <AppContext.Consumer>
      {({ nowHitKeywordListData }) => (
        <KeywordGridStyled>
          {nowHitKeywordListData.keywordList.map((keyword) => (
            <SelectableTile>{keyword}</SelectableTile>
          ))}
        </KeywordGridStyled>
      )}
    </AppContext.Consumer>
  );
};

export default KeywordGrid;

// {nowHitKeywordListData.keywordList.length}
