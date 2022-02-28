import React from "react";
import styled, { css } from "styled-components";
import { DeletableTile } from "../../../components/containers/Tile";

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
  font-size: 0.5em;

  ${(props) =>
    props.rank <= 5 &&
    css`
      color: #fcaf38;
      font-size: 0.75em;
      font-weight: 600;
      text-shadow: 1px 1px 2px #fcaf38;
    `}
`;

const DeleteIcon = styled(RankLayout)`
  color: #415671;
  ${DeletableTile}:hover & {
    display: block;
    color: #921f4b;
  }
`;
export const KeywordStyle = styled.div`
  padding: 0.1em;
  font-size: 0.75em;
  font-weight: 900;
  height: 3em;
  color: black;
  background-color: white;
`;

const HeaderStyle = styled.div`
  height: 4em;
  diplay: grid;
`;
export const KeyboardCardHeaderStyled = styled.div`
  padding: 0.1em;
  display: grid;
  background-color: black;
  grid-template-columns: auto 0.25fr;
  justify-self: end;
`;
// display: flex;
// margin-bottom: 2em;
// align-items: center;
// justify-content: space-between;

const KeywordCardHeader = ({ keyword, rank, region }) => {
  return (
    <HeaderStyle>
      <KeywordStyle>{keyword}</KeywordStyle>

      <KeyboardCardHeaderStyled>
        <RegionLayout>{region}</RegionLayout>
        <RankLayout rank={rank}>{rank}</RankLayout>
      </KeyboardCardHeaderStyled>
    </HeaderStyle>
  );
};

export default KeywordCardHeader;
