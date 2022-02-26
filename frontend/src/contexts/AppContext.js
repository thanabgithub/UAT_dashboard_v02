import React from "react";

// To clean those API functions and move to adapter folders

export const AppContext = React.createContext();

const MAX_AGE_NOWHIT_KEYWORD = 15; // 15 mins
export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "Research",
      isFirstVisit: false,
      ...this.savedSettings(),
      setPage: this.setPage,
      getImage: this.getImage,
      handleConfirmFavorite: this.handleConfirmFavorite,
    };
  }

  componentDidMount = () => {
    console.log("this.state.isFirstVisit: " + this.state.isFirstVisit);
    if (this.state.isFirstVisit) {
      console.log("store preload data");
      this.fetchPreloadKeywordListApi();
    }
    this.getKeywordListRecent();
  };

  getKeywordListRecent = async () => {
    console.log("getKeywordList");
    let myTimestamp = Date.now();
    let keywordListLocalData = await JSON.parse(
      localStorage.getItem("nowHitKeywordList")
    );
    if (!keywordListLocalData) {
      this.fetchKeywordListApi();
    } else {
      let minutesSinceLastFetch =
        (myTimestamp - keywordListLocalData.timestamp) / 1000.0 / 60.0;
      minutesSinceLastFetch = Math.round(minutesSinceLastFetch * 100) / 100;
      console.log("minutesSinceLastFetch: " + minutesSinceLastFetch);
      console.log("myTimestamp: " + myTimestamp);
      console.log(
        "keywordListLocalData.timestamp: " + keywordListLocalData.timestamp
      );

      // 5 mins
      let isExpired = minutesSinceLastFetch > MAX_AGE_NOWHIT_KEYWORD;
      console.log("isExpired: " + isExpired);
      if (isExpired) this.fetchKeywordListApi();
      else {
        let nowHitKeywordListData = keywordListLocalData;
        this.setState({ nowHitKeywordListData });
      }
    }
  };

  fetchKeywordListApi = async () => {
    await fetch("http://10.10.100.2:5050/twitter/regions/keyword-list")
      .then((res) => res.json())
      .then((nowHitKeywordListData) => {
        this.setState({ nowHitKeywordListData });
        localStorage.setItem(
          "nowHitKeywordList",
          JSON.stringify(nowHitKeywordListData)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  fetchPreloadKeywordListApi = async () => {
    await fetch("http://10.10.100.2:5050/twitter/regions/preload-keyword-list")
      .then((res) => res.json())
      .then((nowHitKeywordListData) => {
        this.setState({ nowHitKeywordListData });
        localStorage.setItem(
          "nowHitKeywordList",
          JSON.stringify(nowHitKeywordListData)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  savedSettings = () => {
    console.log("savedSettings");
    let nowHitData = JSON.parse(
      localStorage.getItem("nowHitisExistingVisitor")
    );
    if (!nowHitData) {
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
