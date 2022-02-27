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
  margin-top: 0.5em;
  height: 7em;
  width: 100%;
`;

// function clickKeywordHandler(topSection, keyword, addKeyword, removeKeyword) {
//   return topSection
//     ? () => {
//         removeKeyword(keyword);
//       }
//     : () => {
//         addKeyword(keyword);
//       };
// }

const Layout = styled.div`
  display: d-flex;

  justify-content: space-between;
  height: 6em;
`;

const KeywordCardGrid = ({ index }) => {
  return (
    <AppContext.Consumer>
      {({ pgObjectShow }) => {
        let TileClass = SelectableTile;
        return (
          <TileClass>
            <Layout>
              <KeywordCardHeader
                keyword={pgObjectShow[index].keyword}
                rank={pgObjectShow[index].rank}
                region={pgObjectShow[index].region}
              />

              <ImgStyle>
                <KeywordImage object={pgObjectShow[index]} />
              </ImgStyle>
            </Layout>
          </TileClass>
        );
      }}
    </AppContext.Consumer>
  );
};
export default KeywordCardGrid;
