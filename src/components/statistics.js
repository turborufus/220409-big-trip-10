import Chart from 'chart.js';
import moment from 'moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from './abstract-smart-component';
import {ALL_TYPES, TRANSFER_TYPES} from '../const.js';

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const calculatePointsMoneyByType = (points, eventType) => {
  const pointsByType = points.filter((point) => point.type === eventType);
  if (pointsByType.length > 0) {
    const spentMoney = pointsByType.map((point) => {
      return point.price;
    }).reduce((cost, price) => {
      return cost + price;
    });
    return spentMoney;
  }
  return 0;
};

const calculateTransportPointsByType = (points, type) => {
  return points.filter((point) => point.type === type).length;
};

const formatDurationIntoString = (duration) => {
  const MIN_PER_HOUR = 60;
  const MIN_PER_DAY = 1440;

  const days = Math.floor(duration / MIN_PER_DAY);
  const hours = Math.floor((duration % MIN_PER_DAY) / MIN_PER_HOUR);
  const minutes = Math.floor(((duration % MIN_PER_DAY) % MIN_PER_HOUR));

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }
};

const calculateSpentTimeByDestination = (points, destination) => {
  const pointsByDest = points.filter((point) => point.destination === destination);
  const duration = pointsByDest.map((point) => {
    const momentStop = moment(point.stop);
    const momentStart = moment(point.start);
    return momentStop.diff(momentStart, `minutes`);
  }).reduce((acc, dur) => {
    return acc + dur;
  }, 0);
  return duration;
};

const renderMoneyChart = (ctx, points) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: ALL_TYPES,
      datasets: [{
        data: ALL_TYPES.map((type) => calculatePointsMoneyByType(points, type)),
        backgroundColor: `#ffffff`,
        borderColor: `#ffffff`,
        barPercentage: 0.5,
        barThickness: 50,
        maxBarThickness: 50,
        minBarLength: 30,
        pointBackgroundColor: `#000000`
      }],
    },
    options: {
      plugins: {
        datalabels: {
          formatter(value) {
            return `€` + value;
          },
          font: {
            size: 14
          },
          color: `#000000`,
          align: `start`,
          textAlign: `end`,
          anchor: `end`
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontSize: 18,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          top: 10
        }
      },
      tooltips: {
        enabled: true
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: `left`,
        text: `MONEY`,
        fontSize: 16,
        fontColor: `#000000`,
      },
    },
  });
};

const renderTransportChart = (ctx, points) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: TRANSFER_TYPES,
      datasets: [{
        data: TRANSFER_TYPES.map((type) => calculateTransportPointsByType(points, type)),
        backgroundColor: `#ffffff`,
        borderColor: `#ffffff`,
        barPercentage: 0.5,
        barThickness: 50,
        maxBarThickness: 50,
        minBarLength: 30,
        pointBackgroundColor: `#000000`
      }],
    },
    options: {
      plugins: {
        datalabels: {
          formatter(value) {
            return `${value}x`;
          },
          font: {
            size: 14
          },
          color: `#000000`,
          align: `start`,
          textAlign: `end`,
          anchor: `end`
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontSize: 18,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          top: 10
        }
      },
      tooltips: {
        enabled: true
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: `left`,
        text: `TRANSPORT`,
        fontSize: 16,
        fontColor: `#000000`,
      },
    },
  });
};

const renderTimeSpentChart = (ctx, points) => {
  const destinations = points.map((point) => point.destination).filter(getUniqItems);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: destinations,
      datasets: [{
        data: destinations.map((dest) => calculateSpentTimeByDestination(points, dest)),
        backgroundColor: `#ffffff`,
        borderColor: `#ffffff`,
        barPercentage: 0.5,
        barThickness: 50,
        maxBarThickness: 50,
        minBarLength: 30,
        pointBackgroundColor: `#000000`
      }],
    },
    options: {
      plugins: {
        datalabels: {
          formatter(value) {
            return formatDurationIntoString(value);
          },
          font: {
            size: 14
          },
          color: `#000000`,
          align: `start`,
          textAlign: `end`,
          anchor: `end`
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontSize: 18,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          top: 10
        }
      },
      tooltips: {
        enabled: true
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: `left`,
        text: `TIME SPENT`,
        fontSize: 16,
        fontColor: `#000000`,
      },
    },
  });
};

const createStatisticsTemplate = () => {
  return (`
    <section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`);
};

export default class Statistics extends AbstractSmartComponent {
  constructor(points) {
    super();
    this._points = points;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _renderCharts() {
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._points);
    this._transportChart = renderTransportChart(transportCtx, this._points);
    this._timeSpendChart = renderTimeSpentChart(timeCtx, this._points);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;
    super.rerender();
    this._renderCharts();
  }
}
