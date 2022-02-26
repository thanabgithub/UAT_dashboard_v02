import React from "react";
import { AppContext } from "../../../contexts/AppContext";
import {
  SelectableTile,
  DeletableTile,
  DisableTile,
} from "../../../components/containers/Tile";
import KeywordCardHeader from "./KeywordCardHeader";
import KeywordImage from "./KeywordImage";
import styled from "styled-components";

const ImgStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const KeywordCardGrid = ({ keyword, topSection }) => {
  return (
    <AppContext.Consumer>
      {({ nowHitTwitterAllKeywordsAllNationalRanks }) => {
        let keywordItems =
          nowHitTwitterAllKeywordsAllNationalRanks.data[keyword];
        console.log(keyword);
        let rank = keywordItems.rank;
        let TileClass = SelectableTile;
        if (topSection) {
          TileClass = DeletableTile;
        }
        return (
          <TileClass>
            <KeywordCardHeader
              topSection={topSection}
              keyword={keyword}
              rank={rank}
            />
            <ImgStyle>
              <KeywordImage keyword={keyword} keywordItems={keywordItems} />
            </ImgStyle>
          </TileClass>
        );
      }}
    </AppContext.Consumer>
  );
};
export default KeywordCardGrid;
