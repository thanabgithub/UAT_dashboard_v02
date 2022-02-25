import React from "react";
import styled, { css } from "styled-components";
import { AppContext } from "../../contexts/AppContext";
import { fontFamilyReading } from "../../styles/Variants";
const KeywordGridStyled = styled.div`
  display: grid;
  color: white;

  grid-template-columns: repeat(5, 1fr);
  margin-top: 10px;
  padding: 0px;
  ${fontFamilyReading};
`;

const KeywordGrid = () => {
  return (
    <AppContext.Consumer>
      {({ nowHitKeywordListData }) => (
        <KeywordGridStyled>
          {nowHitKeywordListData.keywordList.map((keyword) => (
            <div>{keyword}</div>
          ))}
        </KeywordGridStyled>
      )}
    </AppContext.Consumer>
  );
};

export default KeywordGrid;

// {nowHitKeywordListData.keywordList.length}
