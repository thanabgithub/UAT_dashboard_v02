import React from "react";
import styled from "styled-components";
import { DeletableTile } from "../../../components/containers/Tile";

export const KeyboardCardHeaderStyled = styled.div`
  display: grid;
  grid-template-columns: auto 0.25fr;
  margin-bottom: 0.5em;
`;

export const KeywordLayout = styled.div`
  justify-self: self-start;
  font-size: 0.75em;
  font-weight: 900;
`;
// export const fontSize2 = "font-size: 0.75em";
// export const fontSize3 = "font-size: .50em";

export const RankLayout = styled.div`
  justify-self: self-end;
  font-size: 0.75em;
`;

const DeleteIcon = styled(RankLayout)`
  color: #415671;
  ${DeletableTile}:hover & {
    display: block;
    color: #921f4b;
  }
`;

const KeywordCardHeader = ({ keyword, rank, topSection }) => {
  return (
    <KeyboardCardHeaderStyled>
      <KeywordLayout>{keyword}</KeywordLayout>
      {topSection ? (
        <DeleteIcon> X </DeleteIcon>
      ) : (
        <RankLayout>{rank}</RankLayout>
      )}
    </KeyboardCardHeaderStyled>
  );
};

export default KeywordCardHeader;
