import React, { Component, PropTypes } from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import AbstractPlatform from '../../../src/AbstractPlatform';
import GaugeComponent from '../GaugeComponent';
import RangeChartComponent from '../RangeChartComponent';

export default class TemperatureSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
		measurementSeries: PropTypes.object.isRequired,
	};

	static getType() {
		return AbstractPlatform.CapabilityType.TEMPERATURE;
	}

	render() {
		return (
			<div className="capability-component temperature-sensor-capability-component">
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
			(item) => item.type === AbstractPlatform.MeasurementType.TEMPERATURE
		) || null;

		if (!measurement) {
			return (
				<div className="loader-wrap">
					<CircularProgress />
				</div>
			);
		}

		const value = measurement.info.T.value;
		const unit = measurement.info.T.unit;

		return (
			<GaugeComponent
				title="Current temperature"
				unit={unit}
				height={200}
				min={0}
				max={100}
				value={value}
			/>
		);
	}

	renderRangeChart() {
		const {
			measurementSeries,
		} = this.props;

		const measurements = measurementSeries[AbstractPlatform.MeasurementType.TEMPERATURE];

		if (!measurements) {
			return null;
		}

		return (
			<RangeChartComponent
				title="Temperature history"
				height={200}
				min={0}
				max={100}
				data={measurements.T}
			/>
		);
	}

}
