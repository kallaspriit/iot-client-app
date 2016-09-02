import React, { Component, PropTypes } from 'react';
import Chart from 'react-highcharts';
import highchartsMore from 'highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';

highchartsMore(Chart.Highcharts);
solidGauge(Chart.Highcharts);

export default class GaugeComponent extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
		height: PropTypes.number,
		value: PropTypes.number,
		min: PropTypes.number,
		max: PropTypes.number,
		unit: PropTypes.string,
	};

	static defaultProps = {
		height: 400,
		value: 0,
		min: 0,
		max: 100,
		unit: '',
	};

	constructor(props) {
		super(props);

		this.chart = null;
	}

	componentWillReceiveProps({
		value,
	}) {
		const chart = this.chart.getChart();

		chart.series[0].points[0].update(this.formatValue(value));
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		const {
			title,
			height,
			value,
			min,
			max,
			unit,
		} = this.props;

		const config = {
			chart: {
				type: 'solidgauge',
				backgroundColor: 'rgba(255, 255, 255, 0)',
				height,
			},

			title,

			pane: {
				center: ['50%', '75%'],
				startAngle: -90,
				endAngle: 90,
				background: {
					backgroundColor: '#EEE',
					innerRadius: '60%',
					outerRadius: '100%',
					shape: 'arc',
				},
			},

			tooltip: {
				enabled: false,
			},

			yAxis: {
				stops: [
					[0.1, '#55BF3B'], // green
					[0.5, '#DDDF0D'], // yellow
					[0.9, '#DF5353'], // red
				],
				lineWidth: 0,
				minorTickInterval: null,
				tickAmount: 2,
				title: {
					text: title,
					y: -50,
				},
				labels: {
					y: 16,
				},
				min,
				max,
			},

			plotOptions: {
				solidgauge: {
					dataLabels: {
						y: -40,
						borderWidth: 0,
						useHTML: true,
					},
				},
			},

			credits: {
				enabled: false,
			},

			series: [{
				name: title,
				data: [this.formatValue(value)],
				dataLabels: {
					format: `<div class="gauge-value-wrap">
						<span class="gauge-value-number">{y}</span><br/>
						<span class="gauge-value-unit">${unit}</span>
					</div>`,
				},
				tooltip: {
					valueSuffix: ` ${unit}`,
				},
			}],
		};

		return (
			<Chart
				ref={c => (this.chart = c)}
				config={config}
			/>
		);
	}

	formatValue(value) {
		return Math.round(value * 10) / 10;
	}

}
