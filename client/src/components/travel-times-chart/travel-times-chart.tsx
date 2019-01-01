import React, { Component } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import moment from "moment";
import * as chroma from "chroma-js";

import ITravelTime from "../../../../common/models/itravel-time";

import "./travel-times-chart.css";

interface TravelTimesChartProps {
  travelTimes: Array<ITravelTime>;
  routeName: string;
}

class TravelTimesChart extends Component<TravelTimesChartProps> {
  private chart: am4charts.XYChart | undefined;
  public static chartCounter: number = 0;

  private get chartId() {
    const { routeName } = this.props;
    return `${routeName}${TravelTimesChart.chartCounter}`;
  }

  constructor(props: TravelTimesChartProps) {
    super(props);
  }

  componentDidMount() {
    this.loadChart();
  }

  public componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  public componentDidUpdate(prevProps: TravelTimesChartProps) {
    if (prevProps.routeName != this.props.routeName && this.chart) {
      this.chart.hide();
      this.chart.dispose();
      this.loadChart();
    }
  }

  private loadChart() {
    let chart = this.createChart();
    this.configureChart(chart);
    this.loadChartData(chart);
    this.chart = chart;
  }

  public render() {
    return <div id={this.chartId} className="travelTimesChart" />;
  }

  private createChart(): am4charts.XYChart {
    return am4core.create(this.chartId, am4charts.XYChart);
  }

  private configureChart(chart: am4charts.XYChart) {
    chart.paddingRight = 20;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis() as any);
    dateAxis.baseInterval = {
      timeUnit: "minute",
      count: 1
    };
    dateAxis.tooltipDateFormat = "HH:mm, d MMMM";

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis() as any);
    valueAxis.tooltip.disabled = true;
    valueAxis.title.text = "Travel Time";

    const series = chart.series.push(new am4charts.LineSeries() as any);
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "travelTime";
    series.tooltipText = "Travel Time: [bold]{valueY}[/]";
    series.fillOpacity = 0.5;
    series.propertyFields.fill = "color";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.opacity = 0;
    chart.scrollbarX = (new am4charts.XYChartScrollbar() as any) as am4core.Scrollbar;
    (chart.scrollbarX as any).series.push(series);

    chart.events.on("datavalidated", function() {
      dateAxis.zoom({ start: 0.8, end: 1 });
    });
  }

  private loadChartData(chart: am4charts.XYChart) {
    const { travelTimes } = this.props;
    const minTravelTime = travelTimes.reduce((a, b) => (a.travelTime < b.travelTime ? a : b));
    const maxTravelTime = travelTimes.reduce((a, b) => (a.travelTime > b.travelTime ? a : b));
    const maxTravelTimeDelta = maxTravelTime.travelTime - minTravelTime.travelTime;
    const green = am4core.color("green");
    const red = am4core.color("red");
    chart.data = travelTimes.map(time => {
      const timeAboveMin = time.travelTime - minTravelTime.travelTime;
      const maxTravelTimePercentile = timeAboveMin / maxTravelTimeDelta;
      return {
        date: moment(time.createdAt).toDate(),
        travelTime: time.travelTime / 60,
        color: chroma.mix(green.rgba, red.rgba, maxTravelTimePercentile).hex()
      };
    });
  }
}

export default TravelTimesChart;
