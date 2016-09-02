import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import CircularProgress from 'material-ui/CircularProgress';

import AbstractPlatform from '../../../src/AbstractPlatform';

export default class ButtonSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	static getType() {
		return AbstractPlatform.CapabilityType.BUTTON;
	}

	render() {
		return (
			<div className="capability-component button-sensor-capability-component">
				{this.renderContents()}
			</div>
		);
	}

	renderContents() {
		const {
			measurements,
		} = this.props;

		const measurement = measurements.find(
			(item) => item.type === AbstractPlatform.MeasurementType.BUTTON
		) || null;

		if (!measurement) {
			return (
				<div className="loader-wrap">
					<CircularProgress />
				</div>
			);
		}

		const isButtonActive = measurement.info.state.value === 1;

		const className = classNames(
			'button-status-wrap', {
				'is-button-active': isButtonActive,
			}
		);

		return (
			<div className={className}>
				{isButtonActive ? 'Button pressed' : 'Button released'}
			</div>
		);
	}
}
