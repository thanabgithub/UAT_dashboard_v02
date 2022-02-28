import Highcharts from "highcharts";

const MediumTimeSeriesChart = (data, colorId) => {
  return {
    chart: {
      zoomType: "x",
      marginTop: 40,
      marginRight: 25,

      height: "60%",
    },

    title: {
      text: "",
    },

    legend: {
      enabled: false,
    },

    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors[colorId]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[colorId])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
        marker: {
          radius: 1.25,
          color: Highcharts.getOptions().colors[colorId],
        },
        lineWidth: 1.25,
        states: {
          hover: {
            lineWidth: 1.75,
            color: Highcharts.getOptions().colors[colorId],
          },
        },
        threshold: null,
      },
    },

    tooltip: {
      formatter: function () {
        var EngToJap = {
            Sunday: "日",
            Monday: "月",
            Tuesday: "火",
            Wednesday: "水",
            Thursday: "木",
            Friday: "金",
            Saturday: "土",
          },
          month = parseInt(Highcharts.dateFormat("%m", this.x)),
          date = parseInt(Highcharts.dateFormat("%d", this.x)),
          hour = Highcharts.dateFormat("%H", this.x),
          dayEng = Highcharts.dateFormat("%A", this.x),
          suf = hour < 12 ? "AM" : "PM";
        return (
          Highcharts.dateFormat(
            month +
              "月" +
              date +
              "日(" +
              EngToJap[dayEng] +
              ") " +
              (hour % 12) +
              suf,
            this.x
          ) +
          ":<br>  <b>" +
          this.y +
          "</b>" +
          "カウント"
        );
      },
    },

    series: [
      {
        type: "area",
        name: "data",
        data: data,
        color: Highcharts.getOptions().colors[colorId],
      },
    ],

    xAxis: {
      type: "datetime",
      labels: {
        formatter: function () {
          var EngToJap = {
              Sunday: "日",
              Monday: "月",
              Tuesday: "火",
              Wednesday: "水",
              Thursday: "木",
              Friday: "金",
              Saturday: "土",
            },
            dayEng = Highcharts.dateFormat("%A", this.value);
          return EngToJap[dayEng];
          // return Highcharts.dateFormat(
          //   month + "月" + date + "日(" + EngToJap[dayEng] + ")",
          //   this.value
          //);
        },
      },

      tickInterval: 24 * 3600 * 1000,
    },

    yAxis: {
      title: {
        text: "",
      },
      endOnTick: false,
      labels: { padding: 0, offset: 0, margin: 0 },
      margin: 0,
    },
  };
};

export default MediumTimeSeriesChart;
