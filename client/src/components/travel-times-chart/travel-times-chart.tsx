import React, { Component } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import moment from "moment";

import ITravelTime from "../../../../common/models/itravel-time";

import "./travel-times-chart.css";

interface TravelTimesChartProps {
  travelTimes: Array<ITravelTime>;
}

class TravelTimesChart extends Component<TravelTimesChartProps> {
  private chart: am4charts.XYChart | undefined;

  constructor(props: TravelTimesChartProps) {
    super(props);
  }

  componentDidMount() {
    let chart = this.createChart();
    this.configureChart(chart);
    this.loadChartData(chart);
    this.chart = chart;
  }

  public componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  public render() {
    return <div id="chartdiv" className="travelTimesChart" />;
  }

  private createChart(): am4charts.XYChart {
    return am4core.create("chartdiv", am4charts.XYChart);
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
    series.fillOpacity = 0.3;

    // Make bullets grow on hover
    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 1;
    bullet.circle.radius = 2;
    bullet.circle.fill = am4core.color("#fff");

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
    chart.data = travelTimes.map(time => {
      return {
        date: moment(time.createdAt).toDate(),
        travelTime: time.travelTime / 60
      };
    });
  }
}

export default TravelTimesChart;
