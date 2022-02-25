import React from "react";

import ConfirmFavoriteButton from "./ConfirmFavoriteButton";
import WelcomeMessage from "./WelcomeMessage";
import PageController from "../facilitators/PageValidator";
import KeywordGrid from "./KeywordGrid";

export default function Settings(props) {
  return (
    <PageController name="Settings">
      <WelcomeMessage />

      <ConfirmFavoriteButton />

      <KeywordGrid />
    </PageController>
  );
}
