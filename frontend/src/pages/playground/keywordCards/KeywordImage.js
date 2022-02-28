import React from "react";
// using maxHeight, maxWidth is a technique to ensure it fit  those 7em, 9em comes from calculation
const KeywordImage = ({ object, style }) => {
  return (
    <img
      alt={object.keyword}
      style={style || { maxHeight: "80%", maxWidth: "80%" }}
      src={object.imgURL}
    />
  );
};

export default KeywordImage;
