import React, { Component, PropTypes } from 'react';
import changeCase from 'change-case';

import AbstractPlatform from '../../../src/AbstractPlatform';

export default class HardwareCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	static getType() {
		return AbstractPlatform.CapabilityType.HARDWARE;
	}

	render() {
		return (
			<div className="capability-component hardware-capability-component">
				{this.renderInfoList()}
			</div>
		);
	}

	renderInfoList() {
		return (
			<ul className="info-list">
				{Object.keys(this.props.capability.info).map(
					(key) => this.renderInfoListItem(key, this.props.capability.info[key])
				)}
			</ul>
		);
	}

	renderInfoListItem(key, value) {
		return (
			<li key={key}>
				<strong>{changeCase.sentenceCase(key)}:</strong> {value}
			</li>
		);
	}
}
