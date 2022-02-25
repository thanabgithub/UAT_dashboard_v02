import React from "react";
import { AppContext } from "../../contexts/AppContext";
import ConfirmFavoriteButton from "./ConfirmFavoriteButton";
import WelcomeMessage from "./WelcomeMessage";

export default function Welcome(props) {
  return (
    <AppContext.Consumer>
      {({ page, setPage }) => (
        <div>
          <h1>{page}</h1>
          <WelcomeMessage />
          <ConfirmFavoriteButton />
        </div>
      )}
    </AppContext.Consumer>
  );
}
