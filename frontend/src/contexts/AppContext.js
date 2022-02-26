import React from "react";

// To clean those API functions and move to adapter folders

export const AppContext = React.createContext();
export const MAX_FAVORITES = 50;

const TWITTER_ALL_KEYWORDS_ALL_NATIONAL_RANKS_URL =
  "http://10.10.100.2:5050/twitter/keywords/national-ranks/all";

const MAX_AGE_DATA_GRID = 5 * 60 * 60;
// 6 hours

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
        console.log(nowHitTwitterAllKeywordsAllNationalRanks);
        console.log(Object.keys(nowHitTwitterAllKeywordsAllNationalRanks.data));
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
    let nowHitisExistingVisitor = JSON.parse(
      localStorage.getItem("nowHitisExistingVisitor")
    );

    if (!nowHitisExistingVisitor) {
      console.log("isNewVisit");

      return { page: "Settings", isFirstVisit: true };
    }

    return { page: "Research" };
  };

  handleConfirmFavorite = () => {
    console.log("handleConfirmFavorite");
    this.setState({ page: "Research", isFirstVisit: false });
    localStorage.setItem("nowHitisExistingVisitor", JSON.stringify(true));
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
