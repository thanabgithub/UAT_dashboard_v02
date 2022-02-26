import React from "react";

const KeywordImage = ({ keyword, keywordItems, style }) => {
  return (
    <img
      alt={keyword}
      style={style || { height: "5em" }}
      src={keywordItems.imgURL}
    />
  );
};

export default KeywordImage;
