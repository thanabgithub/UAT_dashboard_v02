const theme = {
  colors: ["#AA0000", "#212529", "#4D8848"],
  chart: {
    backgroundColor: {
      linearGradient: [0, 0, 500, 500],
      stops: [
        [0, "rgb(256, 256, 256)"],
        [1, "rgb(256, 256, 256)"],
      ],
    },
  },
  credits: { enabled: false },
  xAxis: {
    gridLineWidth: 0,
    labels: {
      style: { color: "###212529" },
    },
    lineWidth: 0,
  },
  yAxis: {
    gridLineWidth: 0,
    labels: {
      style: { color: "###212529" },
    },
  },
  title: {
    style: {
      color: "#000",
      font: 'bold 16px "Trebuchet MS", Verdana, sans-serif',
    },
  },
  subtitle: {
    style: {
      color: "##000",
      font: 'bold 12px "Trebuchet MS", Verdana, sans-serif',
    },
  },
  legend: {
    itemStyle: {
      font: "9pt Trebuchet MS, Verdana, sans-serif",
      color: "",
    },
    itemHoverStyle: {
      color: "",
    },
  },
};

export default theme;
