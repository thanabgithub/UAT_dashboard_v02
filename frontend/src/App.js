import React, { Component } from "react";
import "./styles/default.css";
import Welcome from "./pages/setting/Setting";
import styled, { css } from "styled-components";

const MyContainer = styled.div`
  color: green;
  ${(props) =>
    props.primary &&
    css`
      color: palevioletred;
    `}
`;

const NewContainer = styled(MyContainer)`
  color: tomato;
  font-size: 100px;
`;

class App extends Component {
  render() {
    return (
      <div>
        {" "}
        <MyContainer primary>
          <Welcome name="NowHit" />
        </MyContainer>
        <NewContainer>test</NewContainer>
      </div>
    );
  }
}

export default App;
