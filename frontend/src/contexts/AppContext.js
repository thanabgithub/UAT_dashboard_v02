import React from "react";
import _ from "lodash";

// To clean those API functions and move to adapter folders

export const AppContext = React.createContext();
export const MAX_FAVORITES = 50;

const TWITTER_REGIONAL_RANKS_URL =
  "https://thana-b-5d3s3t45341axzdm.socketxp.com/twitter/regional-ranks/keywords";

const MAX_AGE_DATA_GRID = 5 * 60;
// 5 mins

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
      pgObject: {},
      pgObjectShow: {},

      UnshownRegionsStatus: {},
      isInUnshowns: this.isInUnshowns,
      handleRegionSelect: this.handleRegionSelect,
    };
  }

  filterPgObject = () => {
    let UnshownRegionsStatus = this.state.UnshownRegionsStatus;
    let keys = Object.keys(UnshownRegionsStatus);

    let interestList = keys.filter(
      (key) => UnshownRegionsStatus[key] === false
    );
    console.log(interestList);
    let extractData = this.state.trrData;
    console.log(extractData.data);
    let data = extractData.data;
    let index = data.index;
    let region = data.region;
    let keyword = data.keyword;
    let rank = data.rank;
    let imgURL = data.imgURL;

    let indexMem = [];

    region.forEach((e_region, i_region) => {
      region[i_region] = e_region.normalize("NFD");
    });

    interestList.forEach((e_interest, i_interest) => {
      interestList[i_interest] = e_interest.normalize("NFD");
    });

    function distinct(value, index, self) {
      return self.indexOf(value) === index;
    }

    let interestIndex = [];
    region.forEach((element, index) => {
      if (interestList.includes(element)) {
        interestIndex.push(index);
      }
    });
    console.log(interestIndex);
    console.log(rank[interestIndex]);
    console.log(rank);

    index = index.filter((element, index) => interestIndex.includes(index));
    region = region.filter((element, index) => interestIndex.includes(index));
    keyword = keyword.filter((element, index) => interestIndex.includes(index));
    rank = rank.filter((element, index) => interestIndex.includes(index));
    imgURL = imgURL.filter((element, index) => interestIndex.includes(index));
    console.log(index);
    console.log(region);
    console.log(keyword);
    console.log(rank);
    console.log(imgURL);

    const assembleArrayFilter = (index, keyword, rank, region, imgURL) =>
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

    let pgObjectShow = assembleArrayFilter(
      index,
      keyword,
      rank,
      region,
      imgURL
    );
    this.setState({ pgObjectShow });
    console.log("this.state.pgObject");
    console.log(this.state.pgObject);
    console.log("pgObjectShow");
    console.log(pgObjectShow);
  };

  initUnshownRegionsStatus = () => {
    function distinct(value, index, self) {
      return self.indexOf(value) === index;
    }

    let extractData = this.state.trrData;
    let uniqueRegion = extractData.data.region.filter(distinct);
    console.log("uniqueRegion: " + uniqueRegion);
    let createdObject = Object.fromEntries(
      uniqueRegion.map((element, index) => [element, false])
    );
    console.log("createdObject: " + createdObject);
    console.log(
      "createdObject[uniqueRegion[0]]: " + createdObject[uniqueRegion[0]]
    );
    let UnshownRegionsStatus = createdObject;
    this.setState({ UnshownRegionsStatus });
    this.setState({ uniqueRegion });
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
    this.filterPgObject();
  };
  ///////////////////////////

  initPgObjectShow = () => {
    let pgObjectShow = this.state.pgObject;
    this.setState({ pgObjectShow });
    console.log("in initPgObjectShow");
    console.log(pgObjectShow);
  };

  componentDidMount = () => {
    console.log("in componentDidMount ");
    this.dataLoadController();
  };
  ///////////////////////////
  componentWillUnmount() {
    this.storeCurrentPage();
  }
  storeCurrentPage = () => {
    localStorage.setItem(
      "nowHitCurrentPage",
      JSON.stringify(this.state.currentPage)
    );
  };

  fetchTrrDataAsRequired = () => {
    console.log("in fetchTrrDataAsRequired ");
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

  setpgObject = () => {
    console.log("start setpgObject !");

    let extractData = this.state.trrData;
    console.log(Object.keys(extractData).length);

    console.log(extractData);

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

    let pgObject = assembleArray(index, keyword, rank, region, imgURL);
    const report = (display) => console.log(display);
    this.setState({ pgObject });
    report(pgObject);
    localStorage.setItem("noHitpgObject", JSON.stringify(pgObject));
  };

  fetchTwRegionalRanksAPI = async () => {
    console.log("in fetchTwRegionalRanksAPI");
    await fetch(TWITTER_REGIONAL_RANKS_URL)
      .then((res) => res.json())
      .then((extractData) => {
        console.log(extractData);

        let trrData = extractData;
        this.setState({ trrData });

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

  dataLoadController = async () => {
    console.log("start dataLoadController");
    let extractData = JSON.parse(localStorage.getItem("nowHitTrrDataCache"));
    if (!extractData) {
      let trrData = extractData;
      await this.fetchTwRegionalRanksAPI().then(() => {
        this.setpgObject();
        localStorage.setItem("nowHitTrrData", JSON.stringify(trrData));
      });
    }
    this.setpgObject();
    this.initPgObjectShow();
    this.initUnshownRegionsStatus();

    console.log("end dataLoadController");
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
