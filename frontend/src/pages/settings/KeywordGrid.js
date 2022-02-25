import React from "react";
import styled, { css } from "styled-components";
import { AppContext } from "../../contexts/AppContext";

const KeywordGridStyled = styled.div`
  display: grid;
  color: white;
  font-family: ZenMaruGothic;
  grid-template-columns: repeat(5, 1fr);
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
