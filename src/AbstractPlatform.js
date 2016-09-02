import request from 'axios';
import keyMirror from 'keymirror';

export default class AbstractPlatform {

	static AggregationType = keyMirror({
		DAILY: null,
		HOURLY: null,
		MINUTELY: null,
		NONE: null,
	});

	static CapabilityType = keyMirror({
		UNSUPPORTED: null,
		HARDWARE: null,
		RELAY: null,
		LIGHT: null,
		MOTION: null,
		POSITION: null,
		BUTTON: null,
		TEMPERATURE: null,
		MONITORING: null,
		DIGITAL_ANALOG_CONVERTER: null,
		WEATHER: null,
	});

	static MeasurementType = keyMirror({
		UNSUPPORTED: null,
		LIGHT: null,
		MOTION: null,
		RELAY: null,
		BUTTON: null,
		TEMPERATURE: null,
		MONITORING: null,
		WEATHER: null,
	});

	constructor() {
		this.store = null;
	}

	setStore(store) {
		this.store = store;
	}

	authenticate(tenant, username, password) {}
	getDevices() {}
	getDevice(id) {}
	getDeviceLatestMeasurements(
		deviceId,
		pageSize = 10,
		fragmentType = null
	) {}
	getMeasurementSeries(
		deviceId,
		dateFrom = new Date(Date.now() - (24 * 60 * 60 * 1000)),
		dateTo = new Date(),
		aggregationType = AbstractPlatform.AggregationType.MINUTELY,
		pageSize = 1440,
		isRevertedOrder = true
	) {}
	sendDeviceOperation(deviceId, description, payload) {}
	getRealtimeUpdates(channel, callback) {}

	_get(url) {
		return this._request({
			url,
			method: 'get',
		});
	}

	_post(url, data, headers = {}) {
		return this._request({
			url,
			data,
			headers,
			method: 'post',
		});
	}

	_request({
		url,
		method = 'get',
		...rest,
	}) {
		return request({
			...this._getStandardRequestParameters(),
			url,
			method,
			...rest,
		});
	}

	_getStandardRequestParameters() {
		return {};
	}
}
