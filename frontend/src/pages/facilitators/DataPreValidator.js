import React from "react";

import { AppContext } from "../../contexts/AppContext";

const DataPreValidator = (props) => {
  return (
    <AppContext.Consumer>
      {({ pgObject, uniqueRegion }) => {
        console.log("in DataPreValidator");
        let hasData = Object.keys(pgObject).length > 0;

        console.log("hasData: " + hasData);
        if (!pgObject || !hasData || !uniqueRegion) {
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
