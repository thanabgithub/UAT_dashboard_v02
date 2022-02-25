import React from "react";
import { AppContext } from "../../contexts/AppContext";
export default function Welcome(props) {
  return (
    <AppContext.Consumer>
      {({ isFirstVisit }) =>
        isFirstVisit ? <h2>Welcome to ようこそ {props.name}</h2> : null
      }
    </AppContext.Consumer>
  );
}
