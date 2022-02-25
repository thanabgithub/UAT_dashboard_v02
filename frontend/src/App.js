import React, { Component } from "react";

import "./styles/Fonts.js";
import Setting from "./pages/setting/Setting";

import AppLayout from "./components/containers/AppLayout";
import AppBar from "./components/elements/appBar/AppBar";
import { AppProvider } from "./contexts/AppContext";

class App extends Component {
  render() {
    return (
      <AppLayout>
        <AppProvider>
          {/* the functionality of context provider is to restrict scope of context */}
          <AppBar />
          <Setting name="NowHit" />
        </AppProvider>
      </AppLayout>
    );
  }
}

export default App;
