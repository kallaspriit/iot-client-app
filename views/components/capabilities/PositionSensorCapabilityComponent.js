import React, { Component, PropTypes } from 'react';

import GoogleMap from 'google-map-react';

import googleConfig from '../../../config/google-config';
import AbstractPlatform from '../../../src/AbstractPlatform';

function Marker({
	text,
}) {
	return (
		<div className="marker-component">
			{text ? <div className="marker-component-text">{text}</div> : null}
		</div>
	);
}

Marker.propTypes = {
	text: PropTypes.string,
};

Marker.defaultProps = {
	text: '',
};

export default class PositionSensorCapabilityComponent extends Component {

	static propTypes = {
		capability: PropTypes.object.isRequired,
		deviceInfo: PropTypes.object.isRequired,
		measurements: PropTypes.array.isRequired,
	};

	static getType() {
		return AbstractPlatform.CapabilityType.POSITION;
	}

	render() {
		return (
			<div className="capability-component position-sensor-capability-component">
				{this.renderContents()}
			</div>
		);
	}

	renderContents() {
		const {
			lat,
			lng,
			alt,
		} = this.props.capability.info;

		return (
			<GoogleMap
				bootstrapURLKeys={{
					key: googleConfig.apiKey,
				}}
				center={[lat, lng]}
				zoom={10}
			>
				<Marker lat={lat} lng={lng} text={`Altitude: ${Math.round(alt * 10) / 10}m`} />
			</GoogleMap>
		);
	}

}
