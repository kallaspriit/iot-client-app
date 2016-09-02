import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardTitle from 'material-ui/Card/CardTitle';
import MenuItem from 'material-ui/MenuItem';

import AbstractPlatform from '../src/AbstractPlatform';

import HeaderComponent from './components/HeaderComponent';
import AsyncComponent from './components/AsyncComponent';

import * as capabilities from './components/capabilities';
import * as platformActions from '../actions/platform-actions';

class DeviceView extends Component {

	static propTypes = {
		params: PropTypes.object.isRequired,
		device: PropTypes.object.isRequired,
		realtime: PropTypes.object.isRequired,
		latestMeasurements: PropTypes.object.isRequired,
		measurementSeries: PropTypes.object.isRequired,

		getDevice: PropTypes.func.isRequired,
		getDeviceLatestMeasurements: PropTypes.func.isRequired,
		getMeasurementSeries: PropTypes.func.isRequired,
		getRealtimeUpdates: PropTypes.func.isRequired,
		stopRealtimeUpdates: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.isInitialDataLoaded = false;
		this.loadedDeviceId = null;
	}

	componentWillMount() {
		this.loadDeviceInfo(this.props.params.deviceId);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.deviceId !== this.props.params.deviceId) {
			this.loadDeviceInfo(nextProps.params.deviceId);
		}
	}

	componentWillUnmount() {
		this.stopRealtimeUpdates();
	}

	render() {
		const {
			device,
		} = this.props;

		const title = !device.info || device.isLoading
			? 'Devices » loading...'
			: `Devices » ${device.info.name}`;

		return (
			<div className="device-view">
				<HeaderComponent title={title} menus={this.renderHeaderMenus()} />
				<AsyncComponent info={device} render={this.renderDevice.bind(this)} />
			</div>
		);
	}

	renderDevice(info) {
		const backgroundImage = this.getBackgroundImage(info);

		return (
			<Card className="main-contents">
				<CardHeader
					title="Priit Kallas"
					subtitle="Lai 29 4th floor"
					avatar="/gfx/images/avatar.png"
				/>
				<CardMedia
					overlay={
						<CardTitle
							title={info.name}
							subtitle={`${info.model} - ${info.serial}`}
						/>
					}
				>
					<img
						src={backgroundImage}
						alt={info.type}
					/>
				</CardMedia>
				{this.renderDeviceCapabilityList(info)}
				{this.renderChildDeviceList(info.childDevices)}
			</Card>
		);
	}

	renderDeviceCapabilityList(info) {
		if (info.capabilities.length === 0) {
			return null;
		}

		return (
			<List>
				{info.capabilities.map((capability, index) => this.renderCapabilityListItem(info, capability, index))}
			</List>
		);
	}

	renderCapabilityListItem(info, capability, index) {
		return (
			<ListItem
				key={index}
			>
				{this.renderCapabilityWidget(info, capability)}
			</ListItem>
		);
	}

	renderCapabilityWidget(deviceInfo, capability) {
		const channel = this.getDeviceMeasurementsChannelName(this.props.params.deviceId);
		const realtimeUpdates = this.props.realtime[channel] || [];
		const measurementSeries = this.props.measurementSeries.info[this.props.params.deviceId] || {};
		let measurements = this.getRealtimeUpdateMeasurements(realtimeUpdates);

		// use latest measurements if realtime info is not available
		if (measurements.length === 0) {
			measurements = this.props.latestMeasurements.info[deviceInfo.id] || [];
		}

		const capabilityProps = {
			capability,
			deviceInfo,
			measurements,
			measurementSeries,
		};

		const capabilityComponent = this.getCapabilityComponentByType(capability.type);

		if (capabilityComponent === null) {
			console.warn(`capability type "${capability.type}" is not supported`);

			return null;
		}

		return React.createElement(capabilityComponent, capabilityProps);
	}

	renderChildDeviceList(childDevices) {
		if (childDevices.length === 0) {
			return null;
		}

		return (
			<List>
				<Subheader>Child devices</Subheader>
				{childDevices.map(this.renderChildDeviceListItem)}
			</List>
		);
	}

	renderChildDeviceListItem(device) {
		return (
			<ListItem
				key={device.id}
				primaryText={device.name}
				onTouchTap={() => browserHistory.push(`/devices/${device.id}`)}
			/>
		);
	}

	renderHeaderMenus() {
		return [
			<MenuItem key={1} onTouchTap={() => this.handleRefresh()}>Refresh</MenuItem>,
		];
	}

	handleRefresh() {
		this.props.getDevice(this.props.params.deviceId);
	}

	loadDeviceInfo(deviceId) {
		this.props.getDevice(deviceId);
		this.props.getDeviceLatestMeasurements(deviceId);
		this.props.getMeasurementSeries(
			deviceId,
			new Date(Date.now() - (60 * 60 * 1000)),
			new Date(),
			AbstractPlatform.AggregationType.MINUTELY,
			60,
			true
		);

		if (this.loadedDeviceId !== null) {
			this.stopRealtimeUpdates(this.loadedDeviceId);
		}

		this.setupRealtimeUpdates(deviceId);

		this.loadedDeviceId = deviceId;
	}

	getBackgroundImage(info) {
		const modelToBackgroundMap = {
			RaspPi: '/gfx/images/devices/raspberry.jpg',
		};
		const capabilityToBackgroundMap = {
			[AbstractPlatform.CapabilityType.LIGHT]: '/gfx/images/devices/light.jpg',
			[AbstractPlatform.CapabilityType.MOTION]: '/gfx/images/devices/motion.jpg',
			[AbstractPlatform.CapabilityType.RELAY]: '/gfx/images/devices/relay.jpg',
			[AbstractPlatform.CapabilityType.POSITION]: '/gfx/images/devices/position.jpg',
			[AbstractPlatform.CapabilityType.BUTTON]: '/gfx/images/devices/button.jpg',
			[AbstractPlatform.CapabilityType.TEMPERATURE]: '/gfx/images/devices/temperature.jpg',
			[AbstractPlatform.CapabilityType.MONITORING]: '/gfx/images/devices/monitoring.jpg',
			[AbstractPlatform.CapabilityType.DIGITAL_ANALOG_CONVERTER]: '/gfx/images/devices/dac.jpg',
			[AbstractPlatform.CapabilityType.WEATHER]: '/gfx/images/devices/weather.jpg',
		};

		// search for capabilities
		let backgroundImage = info.capabilities.reduce((background, capability) => {
			if (background !== null) {
				return background;
			}

			const matchingCapabilityType = Object.keys(capabilityToBackgroundMap).find(
				(capabilityType) => capabilityType === capability.type
			) || null;

			if (matchingCapabilityType) {
				return capabilityToBackgroundMap[matchingCapabilityType];
			}

			return background;
		}, null);

		if (backgroundImage === null) {
			backgroundImage = Object.keys(modelToBackgroundMap).reduce((background, pattern) => {
				const regexp = new RegExp(pattern);

				if (regexp.test(info.model)) {
					background = modelToBackgroundMap[pattern]; // eslint-disable-line
				}

				return background;
			}, null);
		}

		if (backgroundImage === null) {
			backgroundImage = '/gfx/images/devices/computer.jpg';
		}

		return backgroundImage;
	}

	getRealtimeUpdateMeasurements(realtimeUpdates) {
		const measurements = [];

		for (let i = 0; i < realtimeUpdates.length; i++) {
			for (let j = 0; j < realtimeUpdates[i].length; j++) {
				measurements.push(realtimeUpdates[i][j]);
			}
		}

		return measurements;
	}

	getCapabilityComponentByType(type) {
		const capabilityComponentNames = Object.keys(capabilities);

		for (let i = 0; i < capabilityComponentNames.length; i++) {
			const capabilityComponentName = capabilityComponentNames[i];

			if (capabilities[capabilityComponentName].getType() === type) {
				return capabilities[capabilityComponentName];
			}
		}

		return null;
	}

	setupRealtimeUpdates(deviceId) {
		const channel = this.getDeviceMeasurementsChannelName(deviceId);

		this.props.getRealtimeUpdates(channel);
	}

	stopRealtimeUpdates(deviceId) {
		const channel = this.getDeviceMeasurementsChannelName(deviceId);

		this.props.stopRealtimeUpdates(channel);
	}

	getDeviceMeasurementsChannelName(deviceId) {
		return `/measurements/${deviceId}`;
	}
}

export default connect(
	state => ({
		device: state.device,
		realtime: state.realtime,
		latestMeasurements: state.latestMeasurements,
		measurementSeries: state.measurementSeries,
	}), {
		...platformActions,
	}
)(DeviceView);
