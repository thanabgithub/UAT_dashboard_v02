import React from "react";

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "ダッシュボード",
      isFirstVisit: false,
      ...this.savedSettings(),
      setPage: this.setPage,

      handleConfirmFavorite: this.handleConfirmFavorite,
    };
  }

  savedSettings() {
    let nowHitData = JSON.parse(localStorage.getItem("nowHit"));
    if (!nowHitData) {
      return { page: "設定", isFirstVisit: true };
    }
    return { page: "ダッシュボード" };
  }

  handleConfirmFavorite = () => {
    console.log("handleConfirmFavorite");
    this.setState({ page: "ダッシュボード", isFirstVisit: false });
    localStorage.setItem("nowHit", JSON.stringify({ test: "hello" }));
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
