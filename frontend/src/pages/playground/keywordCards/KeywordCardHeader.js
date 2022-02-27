import React from "react";
import styled from "styled-components";
import { DeletableTile } from "../../../components/containers/Tile";

export const KeyboardCardHeaderStyled = styled.div`
  display: grid;
  grid-template-columns: auto 0.25fr;
  margin-bottom: 0.25em;
  height: 1em;
`;

export const RegionLayout = styled.div`
  justify-self: self-start;
  font-size: 0.5em;
  font-weight: 900;
`;
// export const fontSize2 = "font-size: 0.75em";
// export const fontSize3 = "font-size: .50em";

export const RankLayout = styled.div`
  display: d-flex;
  justify-self: right;
  font-size: 1em;
`;

const DeleteIcon = styled(RankLayout)`
  color: #415671;
  ${DeletableTile}:hover & {
    display: block;
    color: #921f4b;
  }
`;
export const KeywordStyle = styled.div`
  font-size: 0.75em;
  font-weight: 900;
`;
const KeywordCardHeader = ({ keyword, rank, region }) => {
  return (
    <div>
      <KeywordStyle>{keyword}</KeywordStyle>
      <KeyboardCardHeaderStyled>
        <RegionLayout>{region}</RegionLayout>
        <RankLayout>{rank}</RankLayout>
      </KeyboardCardHeaderStyled>
    </div>
  );
};

export default KeywordCardHeader;
