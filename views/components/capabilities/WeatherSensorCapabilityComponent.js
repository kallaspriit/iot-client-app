import React, { Component, PropTypes } from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import AbstractPlatform from '../../../src/AbstractPlatform';
import GaugeComponent from '../GaugeComponent';
import RangeChartComponent from '../RangeChartComponent';

export default class WeatherSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
		measurementSeries: PropTypes.object.isRequired,
	};

	static getType() {
		return AbstractPlatform.CapabilityType.WEATHER;
	}

	render() {
		return (
			<div className="capability-component weather-sensor-capability-component">
				{this.renderGauge()}
				{this.renderRangeChart()}
			</div>
		);
	}

	renderGauge() {
		const {
			measurements,
		} = this.props;

		const measurement = measurements.find(
			(item) => item.type === AbstractPlatform.MeasurementType.WEATHER
		) || null;

		if (!measurement) {
			return (
				<div className="loader-wrap">
					<CircularProgress />
				</div>
			);
		}

		const value = measurement.info.temperature.value;
		// const unit = measurement.info.temperature.unit;

		return (
			<GaugeComponent
				title="Current temperature"
				unit="°C"
				height={200}
				min={0}
				max={30}
				value={value}
			/>
		);
	}

	renderRangeChart() {
		const {
			measurementSeries,
		} = this.props;

		const measurements = measurementSeries[AbstractPlatform.MeasurementType.WEATHER];

		if (!measurements) {
			return null;
		}

		return (
			<RangeChartComponent
				title="Temperature history"
				height={200}
				min={0}
				max={30}
				data={measurements.temperature}
			/>
		);
	}

}
