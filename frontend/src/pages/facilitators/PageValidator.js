import React from "react";

import { AppContext } from "../../contexts/AppContext";

const PageValidator = ({ name, children }) => {
  return (
    <AppContext.Consumer>
      {({ currentPage }) => {
        if (currentPage !== name) {
          return null;
        }
        return (
          <div>
            {/* <h1>{currentPage}</h1> */}
            {children}
          </div>
        );
      }}
    </AppContext.Consumer>
  );
};
export default PageValidator;
