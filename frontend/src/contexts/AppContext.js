import React from "react";
import _ from "lodash";
// To clean those API functions and move to adapter folders

export const AppContext = React.createContext();
export const MAX_FAVORITES = 50;

const TWITTER_REGIONAL_RANKS_URL =
  "http://192.168.1.33:5050/twitter/regional-ranks/keywords";

const MAX_AGE_DATA_GRID = 5 * 60;
// 5 mins

const TWITTER_REGIONAL_LIST = [
  "沖縄",
  "東京",
  "福岡",
  "広島",
  "神戸",
  "京都",
  "大阪",
  "名古屋",
  "高松",
  "浜松",
  "仙台",
  "札幌",
];

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "Playground",
      isFirstVisit: false,

      ...this.savedSettings(),
      trrData: {},
      setCurrentPage: this.setCurrentPage,
      ...this.quickLoad(),
      pdObject: {},

      UnshownRegionsStatus: {},
      isInUnshowns: this.isInUnshowns,
      handleRegionSelect: this.handleRegionSelect,
      ...this.initUnshownRegionsStatus(),
    };
  }
  initUnshownRegionsStatus = () => {
    let createdObject = Object.fromEntries(
      TWITTER_REGIONAL_LIST.map((element, index) => [element, false])
    );
    console.log("createdObject: " + createdObject);
    return {
      UnshownRegionsStatus: createdObject,
    };
  };
  isInUnshowns = (region) => {
    let UnshownRegionsStatus = this.state.UnshownRegionsStatus;

    if (UnshownRegionsStatus[region]) {
      console.log(region);
      console.log(UnshownRegionsStatus[region]);
    }
    let active = UnshownRegionsStatus[region];
    return active;
  };

  handleRegionSelect = async (region) => {
    let UnshownRegionsStatus = this.state.UnshownRegionsStatus;
    UnshownRegionsStatus[region] = !UnshownRegionsStatus[region];
    console.log(region);
    // console.log(UnshownRegionsStatus);
    this.setState({ UnshownRegionsStatus });
  };

  componentDidMount = () => {
    console.log("in componentDidMount");
    console.log("hiroshima: " + this.isInUnshowns("広島"));
    console.log(this.state.UnshownRegionsStatus);
    this.fetchTrrDataAsRequired();
  };
  componentWillUnmount() {
    this.storeCurrentPage();
  }
  storeCurrentPage = () => {
    localStorage.setItem(
      "nowHitCurrentPage",
      JSON.stringify(this.state.currentPage)
    );
  };

  fetchTrrDataAsRequired = async () => {
    console.log("in fetchTrrDataAsRequired");
    let extractData = JSON.parse(localStorage.getItem("nowHitTrrData"));
    let refreshTrrData = true;
    if (extractData) {
      let trrData = extractData;
      this.setState({ trrData });
      let timestamp = extractData.meta.requestTimestampMillisec;
      let now = Date.now();
      let fromLastRequest = now - timestamp;
      console.log(fromLastRequest);
      if (fromLastRequest < MAX_AGE_DATA_GRID) refreshTrrData = false;
      if (refreshTrrData) this.fetchTwRegionalRanksAPI();
    } else this.fetchTwRegionalRanksAPI();
    console.log("right start call back");
  };

  setpdObject = async () => {
    console.log("start setpdObject !");

    let extractData = this.state.trrData;
    console.log(extractData);
    let data = extractData.data;
    let index = data.index;

    if (index) {
      let data = extractData.data;
      let index = data.index;
      let region = data.region;
      let keyword = data.keyword;
      let rank = data.rank;
      let imgURL = data.imgURL;

      const assembleArray = (index, keyword, rank, region, imgURL) =>
        Object.fromEntries(
          index.map((element, index, newObject) => [
            index,

            Object.fromEntries(
              new Map([
                ["keyword", keyword[element]],
                ["rank", rank[element]],
                ["region", region[element]],
                ["imgURL", imgURL[element]],
              ])
            ),
          ])
        );

      let pdObject = assembleArray(index, keyword, rank, region, imgURL);
      const report = (display) => console.log(display);
      this.setState({ pdObject });
      report(pdObject);
    }
  };

  fetchTwRegionalRanksAPI = async () => {
    console.log("in fetchTwRegionalRanksAPI ");
    await fetch(TWITTER_REGIONAL_RANKS_URL)
      .then((res) => res.json())
      .then((extractData) => {
        console.log(extractData);

        let trrData = extractData;
        this.setState({ trrData });
        localStorage.setItem("nowHiTtrrData", JSON.stringify(trrData));
        console.log("API res: " + trrData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  quickLoad = () => {
    console.log("in quickLoad");
    let extractData = JSON.parse(localStorage.getItem("nowHitTrrDataCache"));
    if (extractData) return { trrData: extractData };
  };
  savedSettings = async () => {
    console.log("savedSettings");
  };

  setCurrentPage = (currentPage) => {
    console.log("in setCurrentPage");
    console.log(currentPage);
    this.setState({ currentPage });
  };

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
