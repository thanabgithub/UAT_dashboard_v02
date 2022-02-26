import React from "react";
// using maxHeight, maxWidth is a technique to ensure it fit  those 7em, 9em comes from calculation
const KeywordImage = ({ keyword, keywordItems, style }) => {
  return (
    <img
      alt={keyword}
      style={style || { maxHeight: "100%", maxWidth: "9em" }}
      src={keywordItems.imgURL}
    />
  );
};

export default KeywordImage;
