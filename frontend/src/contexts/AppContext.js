import React from "react";
import _ from "lodash";
// To clean those API functions and move to adapter folders

export const AppContext = React.createContext();
export const MAX_FAVORITES = 50;

const TWITTER_ALL_KEYWORDS_ALL_NATIONAL_RANKS_URL =
  "http://10.10.100.2:5050/twitter/keywords/national-ranks/all";

const MAX_AGE_DATA_GRID = 5 * 60;
// 5 mins

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "Research",
      isFirstVisit: false,
      favorites: [],
      ...this.savedSettings(),
      setPage: this.setPage,
      addKeyword: this.addKeyword,
      removeKeyword: this.removeKeyword,
      isInFavorites: this.isInFavorites,
      handleConfirmFavorite: this.handleConfirmFavorite,
    };
  }
  addKeyword = (keyword) => {
    let favorites = [...this.state.favorites];
    if (favorites.length < MAX_FAVORITES) {
      favorites.push(keyword);
      this.setState({ favorites });
      console.log(this.state.favorites);
    }
  };
  removeKeyword = (keyword) => {
    let favorites = [...this.state.favorites];

    this.setState({ favorites: _.pull(favorites, keyword) });
    console.log(this.state.favorites);
  };

  isInFavorites = (keyword) => _.includes(this.state.favorites, keyword);

  componentDidMount = () => {
    console.log("in componentDidMount");
    let nowHitTwitterAllKeywordsAllNationalRanks = JSON.parse(
      localStorage.getItem("nowHitTwitterAllKeywordsAllNationalRanks")
    );
    let refreshNowHitTwitterAllKeywordsAllNationalRanks = true;
    if (nowHitTwitterAllKeywordsAllNationalRanks) {
      this.setState({ nowHitTwitterAllKeywordsAllNationalRanks });
      let timestamp =
        nowHitTwitterAllKeywordsAllNationalRanks.meta.requestTimestampMillisec;
      let now = Date.now();
      let timePassed = now - timestamp;
      console.log(timePassed);
      if (timePassed < MAX_AGE_DATA_GRID)
        refreshNowHitTwitterAllKeywordsAllNationalRanks = false;
    }

    if (refreshNowHitTwitterAllKeywordsAllNationalRanks)
      this.fetchTwitterAllKeywordsAllNationalRanks();
  };

  fetchTwitterAllKeywordsAllNationalRanks = async () => {
    console.log("in fetchTwitterAllKeywordsAllNationalRanks");
    await fetch(TWITTER_ALL_KEYWORDS_ALL_NATIONAL_RANKS_URL)
      .then((res) => res.json())
      .then((nowHitTwitterAllKeywordsAllNationalRanks) => {
        this.setState({ nowHitTwitterAllKeywordsAllNationalRanks });
        localStorage.setItem(
          "nowHitTwitterAllKeywordsAllNationalRanks",
          JSON.stringify(nowHitTwitterAllKeywordsAllNationalRanks)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  savedSettings = () => {
    console.log("savedSettings");
    let isExistingVisitor = JSON.parse(
      localStorage.getItem("nowHitisExistingVisitor")
    );

    let favorites = JSON.parse(localStorage.getItem("nowHitFavorites"));
    if (!isExistingVisitor || !favorites) {
      return { page: "Settings", isFirstVisit: true };
    }
    if (!favorites) {
      return { page: "Research" };
    }
    return { page: "Research", favorites: favorites };
  };

  handleConfirmFavorite = () => {
    console.log("handleConfirmFavorite");
    this.setState({ page: "Research", isFirstVisit: false });
    localStorage.setItem("nowHitisExistingVisitor", JSON.stringify(true));
    localStorage.setItem(
      "nowHitFavorites",
      JSON.stringify(this.state.favorites)
    );
  };

  setPage = (page) => {
    console.log("in setPage");
    console.log(page);
    this.setState({ page });
  };

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
