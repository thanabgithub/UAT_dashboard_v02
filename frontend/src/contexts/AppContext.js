import React from "react";
import _ from "lodash";

// To clean those API functions and move to adapter folders

export const AppContext = React.createContext();
export const MAX_FAVORITES = 50;
//https://thana-b-5d3s3t45341axzdm.socketxp.com//twitter/regional-ranks/keywords
//http://10.10.100.1:5050//twitter/regional-ranks/keywords
const TWITTER_REGIONAL_RANKS_URL =
  "http://10.10.100.1:5050//twitter/regional-ranks/keywords";

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

    let extractData = this.state.trrData;
    console.log(extractData.data);
    let data = extractData.data;
    let index = data.index;
    let region = data.region;
    let keyword = data.keyword;
    let rank = data.rank;
    let imgURL = data.imgURL;

    console.log("extractData");
    console.log(extractData);

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

    index = index.filter((element, index) => interestIndex.includes(index));
    region = region.filter((element, index) => interestIndex.includes(index));
    keyword = keyword.filter((element, index) => interestIndex.includes(index));
    rank = rank.filter((element, index) => interestIndex.includes(index));
    imgURL = imgURL.filter((element, index) => interestIndex.includes(index));

    let pgObjectShow = this.assembleArrayFilter(
      index,
      keyword,
      rank,
      region,
      imgURL
    );

    this.setState({ pgObjectShow });
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

    let UnshownRegionsStatus = createdObject;
    this.setState({ UnshownRegionsStatus });
    this.setState({ uniqueRegion });
  };
  isInUnshowns = (region) => {
    let UnshownRegionsStatus = this.state.UnshownRegionsStatus;

    let active = UnshownRegionsStatus[region];
    return active;
  };

  handleRegionSelect = async (region) => {
    let UnshownRegionsStatus_before = this.state.UnshownRegionsStatus;

    let UnshownRegionsStatus = UnshownRegionsStatus_before;
    let countUnshown = 0;
    Object.keys(UnshownRegionsStatus_before).forEach((element, key) => {
      if (UnshownRegionsStatus_before[element]) {
        countUnshown = countUnshown + 1;
      }
    });

    if (countUnshown === 0) {
      Object.keys(UnshownRegionsStatus).forEach((element, key) => {
        UnshownRegionsStatus[element] = true;
      });

      UnshownRegionsStatus[region] = false;
    }

    if (countUnshown == 11 && UnshownRegionsStatus_before[region] == false) {
      Object.keys(UnshownRegionsStatus).forEach((element, key) => {
        UnshownRegionsStatus[element] = false;
      });
    }

    if (countUnshown > 0 && UnshownRegionsStatus_before[region] == true) {
      Object.keys(UnshownRegionsStatus).forEach((element, key) => {
        UnshownRegionsStatus[element] = true;
      });
      UnshownRegionsStatus_before[region] =
        !UnshownRegionsStatus_before[region];
    }

    this.setState({ UnshownRegionsStatus });
    this.filterPgObject();
  };
  ///////////////////////////

  initPgObjectShow = () => {
    let pgObjectShow = this.state.pgObject;
    this.setState({ pgObjectShow });
  };

  componentDidMount = () => {
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
  assembleArrayFilter = (index, keyword, rank, region, imgURL) =>
    Object.fromEntries(
      index.map((element, index, newObject) => [
        index,

        Object.fromEntries(
          new Map([
            ["keyword", keyword[index]],
            ["rank", rank[index]],
            ["region", region[index]],
            ["imgURL", imgURL[index]],
          ])
        ),
      ])
    );

  fetchTrrDataAsRequired = () => {
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

    let data = extractData.data;
    let index = data.index;
    let region = data.region;
    let keyword = data.keyword;
    let rank = data.rank;
    let imgURL = data.imgURL;

    let pgObject = this.assembleArrayFilter(
      index,
      keyword,
      rank,
      region,
      imgURL
    );
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
        trrData = this.setpgObject();
        localStorage.setItem("nowHitTrrData", JSON.stringify(trrData));
      });
    } else {
      let timestamp = extractData.meta.requestTimestampMillisec;
      let now = Date.now();
      let fromLastRequest = now - timestamp;

      if (fromLastRequest < MAX_AGE_DATA_GRID) {
        this.fetchTwRegionalRanksAPI();
      }
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
