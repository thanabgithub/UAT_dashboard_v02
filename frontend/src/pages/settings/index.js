import React from "react";

import ConfirmFavoriteButton from "./ConfirmFavoriteButton";
import WelcomeMessage from "./WelcomeMessage";
import PageController from "../facilitators/PageValidator";
export default function Settings(props) {
  return (
    <PageController name="Settings">
      <WelcomeMessage />
      <ConfirmFavoriteButton />
    </PageController>
  );
}
