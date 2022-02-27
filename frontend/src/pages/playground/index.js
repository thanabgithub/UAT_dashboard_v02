import React from "react";
import RegionSelectButtons from "./filter/RegionSelectButtons";
import styled from "styled-components";
import PageValidator from "../facilitators/PageValidator";
import DataPreValidator from "../facilitators/DataPreValidator";

import KeywordGrid from "./KeywordGrid";

const RegionButtonPanel = styled.div``;

const PageDescription = styled.div`
  font-size: 0.75em;
`;

const Playground = (props) => {
  return (
    <PageValidator name="Playground">
      <h3>Playground</h3>
      <PageDescription>
        おや、あの河原は月夜だろうかそっちを見ながらそっと言いました。ジョバンニはもうどぎまぎしてまっ赤になって毛あなからちらけてしまうのでした。{" "}
      </PageDescription>{" "}
      <RegionButtonPanel>
        <RegionSelectButtons />
      </RegionButtonPanel>
      <KeywordGrid />
    </PageValidator>
  );
};

export default Playground;
