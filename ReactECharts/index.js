import React, { Component } from 'react';
import * as echarts from 'echarts';
import PropTypes from 'prop-types';

const isEmpty = function(target){
  if(toString.call(target) !== "[object Object]") return true;
  if(Object.getOwnPropertyNames(target).length === 0) return true;
  return false;
}

class ReactECharts extends Component {
  constructor() {
    super();
    this.chartRef = null;
    this.state = {
      option: {},
    };
  }

  static propTypes = {
    option: PropTypes.object,
    containerStyle: PropTypes.object,
    chartKey: PropTypes.string,
  };

  static defaultProps = {
    option: {},
    containerStyle: {},
    chartKey: '',
  };

  static init(chartKey, option) {
    if (!isEmpty(option)) {
      const chartEl = document.getElementById(chartKey);
      let myChart = echarts.getInstanceByDom(chartEl);
      if (myChart === undefined) {
        myChart = echarts.init(chartEl);
      }
      myChart.setOption(option);
    }
  }

  componentDidMount() {
    const { option, chartKey } = this.props;
    ReactECharts.init(chartKey, option);
  }

  static getDerivedStateFromProps(nextProps) {
    const { option, chartKey } = nextProps;
    try {
      ReactECharts.init(chartKey, option);
    } catch (error) {
      console.log(error.message);
    }
    // 对state不做任何操作
    return null;
  }

  render() {
    const { containerStyle, chartKey } = this.props;
    return (
      <div
        ref={(refs) => {
          this.chartRef = refs;
        }}
        id={chartKey}
        style={{ width: '100%', height: '400px' }}
        className={containerStyle}
      />
    );
  }
}

export default ReactECharts;
