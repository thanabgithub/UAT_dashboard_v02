import React from "react";

import { AppContext } from "../../contexts/AppContext";

const PageValidator = ({ name, children }) => {
  return (
    <AppContext.Consumer>
      {({ page }) => {
        if (page !== name) {
          return null;
        }
        return (
          <div>
            {/* <h1>{page}</h1> */}
            {children}
          </div>
        );
      }}
    </AppContext.Consumer>
  );
};
export default PageValidator;
