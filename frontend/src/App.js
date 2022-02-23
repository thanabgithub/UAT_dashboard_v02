import React, { Component } from "react";
import "./styles/index.css";

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
class App extends Component {
  render() {
    return <Welcome />;
  }
}

export default App;
