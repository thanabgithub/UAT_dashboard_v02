import React from "react";

import ConfirmFavoriteButton from "./ConfirmFavoriteButton";
import WelcomeMessage from "./WelcomeMessage";
import PageController from "../facilitators/PageValidator";
import KeywordGrid from "./KeywordGrid";
import Search from "./search/Search";
export default function Settings(props) {
  return (
    <PageController name="Settings">
      <WelcomeMessage />
      <KeywordGrid topSection />
      <ConfirmFavoriteButton />
      <Search></Search>
      <KeywordGrid />
    </PageController>
  );
}
