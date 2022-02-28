import React from "react";

import styled from "styled-components";
import PageValidator from "../facilitators/PageValidator";
import DataPreValidator from "../facilitators/DataPreValidator";
import { useState } from "react";

const RegionButtonPanel = styled.div``;

const PageDescription = styled.div`
  font-size: 0.75em;
`;

const JP_LOREM_URL =
  "https://lorem-jpsum.vercel.app/api?sentence_count=2&format=plain&source=ginga-tetsudo";

const PageTitle = styled.h2`
  color: #50a3a4;
`;

class Monitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "ほんとうにあなたのほしいものはいったい何ですかと叫ぶようにききました。黄いろのがだんだん向こうへまわって来たりするのでした。",
    };
  }

  componentDidMount() {
    this.fetchText();
  }

  componentWillUnmount() {}

  fetchText = () => {
    fetch(JP_LOREM_URL)
      .then((res) => res.json())
      .then((extractData) => {
        console.log(extractData);
        console.log(extractData.content);
        let word = extractData.content;

        this.setState({ word });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <PageValidator name={this.props.name}>
        <PageTitle>{this.props.name}</PageTitle>
        <PageDescription>{this.state.word}</PageDescription>{" "}
      </PageValidator>
    );
  }
}

export default Monitor;
