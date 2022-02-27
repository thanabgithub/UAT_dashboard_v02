import React, { Component } from "react";

import "./styles/WebFontLoader";
import Playground from "./pages/playground/index";

import AppLayout from "./components/containers/AppLayout";
import AppBar from "./components/elements/appBar/AppBar";
import { AppProvider } from "./contexts/AppContext";
import DataPreValidator from "./pages/facilitators/DataPreValidator";

class App extends Component {
  render() {
    return (
      <AppLayout>
        <AppProvider>
          {/* the functionality of context provider is to restrict scope of context */}
          <AppBar />
          <DataPreValidator>
            <Playground name="NowHit" />
          </DataPreValidator>
        </AppProvider>
      </AppLayout>
    );
  }
}

export default App;
