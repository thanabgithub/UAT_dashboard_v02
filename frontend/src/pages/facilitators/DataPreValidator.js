import React from "react";

import { AppContext } from "../../contexts/AppContext";

const DataPreValidator = (props) => {
  return (
    <AppContext.Consumer>
      {({ nowHitKeywordListData }) => {
        console.log("in DataPreValidator");
        console.log(nowHitKeywordListData);

        if (!nowHitKeywordListData) {
          console.log("読み込み中");

          return (
            <div>
              {" "}
              <h1>. . . 読み込み中 . . .</h1>
            </div>
          );
        }
        return <div> {props.children}</div>;
      }}
    </AppContext.Consumer>
  );
};

export default DataPreValidator;
