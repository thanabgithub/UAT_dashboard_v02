import React from "react";
import RegionSelectButtons from "./filter/RegionSelectButtons";
import styled from "styled-components";
import PageValidator from "../facilitators/PageValidator";
import DataPreValidator from "../facilitators/DataPreValidator";
import { useState } from "react";
import KeywordGrid from "./KeywordGrid";

const RegionButtonPanel = styled.div``;

const PageDescription = styled.div`
  font-size: 0.75em;
`;

const JP_LOREM_URL =
  "https://lorem-jpsum.vercel.app/api?sentence_count=2&format=plain&source=kokoro";
//   const fetchText = () => {
//     fetch(JP_LOREM_URL)
//      .then((res) => res.json())
//      .then((extractData) => {
//        console.log(extractData);
//        console.log(extractData.content);
//        let jPLorem = extractData.content;

//        return jPLorem;
//      })
//      .catch((err) => {
//        console.log(err);
//      });
//  };
const PageTitle = styled.h2`
  color: #50a3a4;
`;
const Playground = (props) => {
  return (
    <PageValidator name="Playground">
      <PageTitle>Playground</PageTitle>
      <PageDescription>
        ザネリはうちへ連れられてったジョバンニは言いながら、少し顔いろが青ざめて、どこか遠くの遠くの方に不思議なものをひろいました。今晩は銀河のお祭りなのです。
      </PageDescription>{" "}
      <RegionButtonPanel>
        <RegionSelectButtons />
      </RegionButtonPanel>
      <KeywordGrid />
    </PageValidator>
  );
};

export default Playground;
