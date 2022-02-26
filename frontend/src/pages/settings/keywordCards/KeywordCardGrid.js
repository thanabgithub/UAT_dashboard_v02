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
  height: 6em;
`;

function clickKeywordHandler(topSection, keyword, addKeyword, removeKeyword) {
  return topSection
    ? () => {
        removeKeyword(keyword);
      }
    : () => {
        addKeyword(keyword);
      };
}

const KeywordCardGrid = ({
  keyword,
  topSection,
  addKeyword,
  removeKeyword,
}) => {
  return (
    <AppContext.Consumer>
      {({
        nowHitTwitterAllKeywordsAllNationalRanks,
        addKeyword,
        removeKeyword,
        isInFavorites,
      }) => {
        let keywordItems =
          nowHitTwitterAllKeywordsAllNationalRanks.data[keyword];
        let rank = keywordItems.rank;
        let TileClass = SelectableTile;
        if (topSection) {
          TileClass = DeletableTile;
        } else if (isInFavorites(keyword)) {
          //TileClass = DisableTile;
          return;
        }
        return (
          <TileClass
            onClick={clickKeywordHandler(
              topSection,
              keyword,
              addKeyword,
              removeKeyword
            )}
          >
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
