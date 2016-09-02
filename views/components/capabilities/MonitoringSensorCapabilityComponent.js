import React, { Component, PropTypes } from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import AbstractPlatform from '../../../src/AbstractPlatform';
import GaugeComponent from '../GaugeComponent';
import RangeChartComponent from '../RangeChartComponent';

export default class MonitoringSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
		measurementSeries: PropTypes.object.isRequired,
	};

	static getType() {
		return AbstractPlatform.CapabilityType.MONITORING;
	}

	render() {
		return (
			<div className="capability-component monitoring-sensor-capability-component">
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
			(item) => item.type === AbstractPlatform.MeasurementType.MONITORING
		) || null;

		if (!measurement) {
			return (
				<div className="loader-wrap">
					<CircularProgress />
				</div>
			);
		}

		const value = measurement.info.freeMemory.value;
		const unit = measurement.info.freeMemory.unit;

		return (
			<GaugeComponent
				title="Current free memory"
				unit={unit}
				height={200}
				min={0}
				max={1000}
				value={value}
			/>
		);
	}

	renderRangeChart() {
		const {
			measurementSeries,
		} = this.props;

		const measurements = measurementSeries[AbstractPlatform.MeasurementType.MONITORING];

		if (!measurements) {
			return null;
		}

		return (
			<RangeChartComponent
				title="Free memory history"
				height={200}
				min={0}
				max={1000}
				data={measurements.freeMemory}
			/>
		);
	}

}
