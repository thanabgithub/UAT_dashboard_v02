import React from "react";
import { AppContext } from "../../../contexts/AppContext";
import {
  Tile,
  SelectableTile,
  DeletableTile,
  DisableTile,
} from "../../../components/containers/Tile";
import KeywordCardHeader from "./KeywordCardHeader";
import KeywordImage from "./KeywordImage";
import styled from "styled-components";

const ImgStyle = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  align-self: stretch;
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
  padding: 0.25em;

  justify-content: stretch;
  align-content: stretch;
`;

const KeywordCardGrid = ({ index }) => {
  return (
    <AppContext.Consumer>
      {({ pgObjectShow }) => {
        let TileClass = Tile;
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
