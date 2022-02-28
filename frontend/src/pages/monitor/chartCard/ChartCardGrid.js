import "../../assets/css/styles.css";

import React from "react";
import {} from "react-bootstrap";
import { Card, Container, Row, Col, CloseButton } from "react-bootstrap";

import MediumTimeSeriesChart from "../subcomponents/highChartsConfig/MediumTimeSeriesChart";
import highChartsTheme from "../subcomponents/highChartsConfig/highChartsTheme";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

Highcharts.setOptions(highChartsTheme);

const ChartCard = ({ timeSeriesData, deleteTimeSeriesData }) => {
  let timeSeriesValue = timeSeriesData.smoothCount;
  let timeSeriesKeyword = timeSeriesData.meta.keyword;
  let timeSeries7DayChg = timeSeriesData.count7DayChg;
  let timeSeriesId = timeSeriesData.id;

  let colorId = 0;
  const mediumTop = 50;
  const mediumBot = -50;
  if (timeSeries7DayChg < mediumTop && timeSeries7DayChg > mediumBot) {
    colorId = 1;
  } else if (timeSeries7DayChg < mediumBot) {
    colorId = 2;
  }

  const options = MediumTimeSeriesChart(timeSeriesValue, colorId);
  return (
    <Container className="justify-content-md-center mt-3">
      <Row className="d-flex justify-content-md-center mx-auto">
        <Col>
          <Card
            style={{ width: "100%" }}
            className="d-flex justify-content-md-center mx-auto  mt-3 my-card-outline"
          >
            <div className="m-0 p-0">
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
            <Card.Body className="reset-padding-margin my-card-body">
              <div className="card-title h7 m-0 p-0">{timeSeriesKeyword}</div>
              <Container className="reset-padding-margin  keep-seperate mb-1">
                <Row className="reset-padding-margin">
                  <Col className="reset-padding-margin" xs="auto">
                    <Card.Text
                      size="sm"
                      className="reset-padding-margin"
                      style={{ fontSize: 10 }}
                    >
                      先週のサンプルより {timeSeries7DayChg} %
                    </Card.Text>
                  </Col>
                  <Col className="reset-padding-margin css-grid">
                    <div className="reset-padding-margin css-grid">
                      <div className="reset-padding-margin align-right">
                        <CloseButton
                          aria-label="Hide"
                          size="sm"
                          onClick={() => {
                            console.log("onClick");
                            console.log(timeSeriesId);
                            deleteTimeSeriesData(timeSeriesId);
                          }}
                          className="rm-glow close-button"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChartCard;
