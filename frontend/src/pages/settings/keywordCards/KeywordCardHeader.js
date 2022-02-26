import React from "react";
import styled from "styled-components";

export const KeyboardCardHeaderStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const KeywordName = styled.div`
  justify-self: right;
`;

const KeywordCardHeader = ({ name, rank }) => {
  return (
    <KeyboardCardHeaderStyled>
      <div> {name}</div> <KeywordName> {rank}</KeywordName>
    </KeyboardCardHeaderStyled>
  );
};

export default KeywordCardHeader;
