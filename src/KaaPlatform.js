import AbstractPlatform from './AbstractPlatform';

import DeviceModel from '../models/DeviceModel';
import CapabilityModel from '../models/CapabilityModel';
import MeasurementModel from '../models/MeasurementModel';

export default class KaaPlatform extends AbstractPlatform {

	static capabilityTypeMapping = {
		c8y_Relay: AbstractPlatform.CapabilityType.RELAY,
		c8y_LightSensor: AbstractPlatform.CapabilityType.LIGHT,
		c8y_MotionSensor: AbstractPlatform.CapabilityType.MOTION,
		c8y_Hardware: AbstractPlatform.CapabilityType.HARDWARE,
		c8y_Position: AbstractPlatform.CapabilityType.POSITION,
		c8y_TemperatureSensor: AbstractPlatform.CapabilityType.TEMPERATURE,
		com_stagnationlab_c8y_driver_sensors_AbstractButtonSensor_ButtonSensor: AbstractPlatform.CapabilityType.BUTTON,
		com_stagnationlab_c8y_driver_sensors_AbstractMonitoringSensor_MonitoringSensor:
			AbstractPlatform.CapabilityType.MONITORING,
		com_stagnationlab_c8y_driver_devices_DigitalAnalogConverter:
			AbstractPlatform.CapabilityType.DIGITAL_ANALOG_CONVERTER,
		com_stagnationlab_c8y_driver_sensors_AbstractWeatherSensor_WeatherSensor:
			AbstractPlatform.CapabilityType.WEATHER,
	};

	static measurementTypeMapping = {
		c8y_LightMeasurement: AbstractPlatform.MeasurementType.LIGHT,
		c8y_TemperatureMeasurement: AbstractPlatform.MeasurementType.TEMPERATURE,
		com_stagnationlab_c8y_driver_measurements_MotionStateMeasurement: AbstractPlatform.MeasurementType.MOTION,
		com_stagnationlab_c8y_driver_measurements_RelayStateMeasurement: AbstractPlatform.MeasurementType.RELAY,
		com_stagnationlab_c8y_driver_measurements_ButtonStateMeasurement: AbstractPlatform.MeasurementType.BUTTON,
		com_stagnationlab_c8y_driver_measurements_DeviceMonitoringMeasurement:
			AbstractPlatform.MeasurementType.MONITORING,
		com_stagnationlab_c8y_driver_measurements_WeatherMeasurement:
			AbstractPlatform.MeasurementType.WEATHER,
	};

	constructor({
		protocol = 'https',
		host = 'cumulocity.com',
	} = {}) {
		super();

		this.network = {
			protocol,
			host,
		};

		this.urls = {
			authenticate: () => 'user/currentUser',
			getDevices: () => 'inventory/managedObjects?fragmentType=c8y_IsDevice',
			getDevice: (id) => `inventory/managedObjects/${id}`,
			getRealtime: () => 'cep/realtime',
			getDeviceLatestMeasurements: (
				deviceId,
				pageSize = 10,
				fragmentType = null
			) => {
				const dateTo = this._formatDate(
					this._getTomorrowsDate()
				);

				return 'measurement/measurements' +
					'?dateFrom=1970-01-01' +
					`&dateTo=${dateTo}` +
					`&pageSize=${pageSize}` +
					'&revert=true' +
					`&source=${deviceId}` +
					`${fragmentType !== null
						? `&fragmentType=${fragmentType}`
						: ''}`;
			},
			getMeasurementSeries: (
				deviceId,
				dateFrom,
				dateTo,
				aggregationType,
				pageSize,
				isRevertedOrder
			) => 'measurement/measurements/series' +
				`?dateFrom=${dateFrom.toISOString()}` +
				`&dateTo=${dateTo.toISOString()}` +
					`${aggregationType !== AbstractPlatform.AggregationType.NONE
						? `&aggregationType=${aggregationType}`
						: ''}` +
					`&pageSize=${pageSize}` +
					`&revert=${isRevertedOrder ? 'true' : 'false'}` +
					`&source=${deviceId}`,
			sendDeviceOperation: () => 'devicecontrol/operations',
		};

		this._realtimeId = 1;
	}

	getName() {
		return 'kaa';
	}

	isUsingTenant() {
		return false;
	}

	authenticate(tenant, username, password) {
		const url = this._buildUrl(
			this.urls.authenticate()
		);

		return this._get(url).then(
			(response) => response.data
		);
	}

	getDevices() {
		const url = this._buildUrl(
			this.urls.getDevices()
		);

		return this._get(url).then(
			(response) => response.data.managedObjects.map(
				this._mapManagedObjectToDevice.bind(this)
			)
		);
	}

	getDevice(id) {
		const url = this._buildUrl(
			this.urls.getDevice(id)
		);

		return this._get(url).then(
			(response) => this._mapManagedObjectToDevice(response.data)
		);
	}

	getDeviceLatestMeasurements(
		deviceId,
		pageSize = 10,
		fragmentType = null
	) {
		const url = this._buildUrl(
			this.urls.getDeviceLatestMeasurements(deviceId)
		);

		return this._get(url).then(
			(response) => {
				const measurements = response.data.measurements.reduce((result, item) => [
					...result,
					...this._extractMeasurements(item),
				], []);

				return {
					[deviceId]: measurements,
				};
			}
		);
	}

	getMeasurementSeries(
		deviceId,
		dateFrom = new Date(Date.now() - (24 * 60 * 60 * 1000)),
		dateTo = new Date(),
		aggregationType = KaaPlatform.AggregationType.NONE,
		pageSize = 24 * 60,
		isRevertedOrder = true
	) {
		const url = this._buildUrl(
			this.urls.getMeasurementSeries(
				deviceId,
				dateFrom,
				dateTo,
				aggregationType,
				pageSize,
				isRevertedOrder
			)
		);

		return this._get(url).then(
			(response) => {
				const values = response.data.values;
				const indexToSeriesMap = {};

				const measurements = response.data.series.reduce((result, item, index) => {
					const type = this._mapMeasurementType(item.type);
					const name = item.name;

					if (type === AbstractPlatform.MeasurementType.UNSUPPORTED) {
						return result;
					}

					indexToSeriesMap[index] = {
						type,
						name,
					};

					const newResult = {
						...result,
					};

					if (typeof newResult[type] === 'undefined') {
						newResult[type] = {};
					}

					newResult[type][name] = [];

					return newResult;
				}, {});

				Object.keys(values).forEach((timestamp) => {
					const value = values[timestamp];

					for (let i = 0; i < value.length; i++) {
						if (typeof indexToSeriesMap[i] === 'undefined') {
							continue;
						}

						const {
							type,
							name,
						} = indexToSeriesMap[i];

						if (typeof type === 'undefined' || value[i] === null) {
							continue;
						}

						measurements[type][name].push([new Date(timestamp), value[i].min, value[i].max]);
					}
				});

				return {
					[deviceId]: measurements,
				};
			}
		);
	}

	sendDeviceOperation(deviceId, description, payload) {
		const url = this._buildUrl(
			this.urls.sendDeviceOperation()
		);
		const data = {
			deviceId,
			description,
			...payload,
		};

		const headers = {
			'Content-Type': 'application/vnd.com.nsn.cumulocity.operation+json',
		};

		return this._post(url, data, headers).then(
			(response) => response.data.c8y_Relay
		);
	}

	getRealtimeUpdates(channel, callback) {
		let isActive = true;

		this._performRealtimeSubscription(channel).then((clientId) => {
			const connect = () => {
				this._performRealtimeConnect(clientId).then((updates) => {
					callback(
						this._generifyRealtimeUpdates(updates)
					);

					if (isActive) {
						connect();
					}
				});
			};

			connect();
		});

		return () => {
			isActive = false;
		};
	}

	// rest is private
	_generifyRealtimeUpdates(_updates) {
		return _updates
			.filter((update) => update.data && update.data.data)
			.map((update) => this._extractMeasurements(update.data.data))
			.filter((update) => update !== null);
	}

	_performRealtimeSubscription(subscription) {
		return this._performRealtimeHandshake().then((clientId) => {
			const url = this._buildUrl(this.urls.getRealtime());
			const payload = [{
				channel: '/meta/subscribe',
				id: this._getNextRealtimeId(),
				subscription,
				clientId,
			}];

			return this._post(url, payload).then((response) => {
				if (!Array.isArray(response.data) || response.data.length !== 1) {
					console.error('got invalid handshake response', payload, response.data);

					throw new Error('Got invalid handshake response');
				}

				const info = response.data[0];

				if (!info.successful) {
					throw new Error(`Subscription failed (${info.error})`);
				}

				return clientId;
			});
		});
	}

	_performRealtimeConnect(clientId) {
		const url = this._buildUrl(
			this.urls.getRealtime()
		);
		const payload = [{
			clientId,
			id: this._getNextRealtimeId(),
			channel: '/meta/connect',
			connectionType: 'long-polling',
		}];

		return this._post(url, payload).then((response) => {
			if (!Array.isArray(response.data)) {
				console.error('got invalid handshake response', payload, response.data);

				throw new Error('Got invalid handshake response');
			}

			return response.data;
		});
	}

	_performRealtimeHandshake() {
		const url = this._buildUrl(
			this.urls.getRealtime()
		);
		const payload = [{
			channel: '/meta/handshake',
			id: this._getNextRealtimeId(),
			version: '1.0',
			minimumVersion: '0.9',
			supportedConnectionTypes: [
				'long-polling',
				'callback-polling',
			],
			advice: {
				timeout: 60000,
				interval: 0,
			},
		}];

		return this._post(url, payload).then((response) => {
			if (!Array.isArray(response.data) || response.data.length !== 1) {
				console.error('got invalid handshake response', payload, response.data);

				throw new Error('Got invalid handshake response');
			}

			const info = response.data[0];

			if (!info.successful) {
				throw new Error(`Handshake failed (${info.error})`);
			}

			const clientId = info.clientId;

			return clientId;
		});
	}

	_extractMeasurements(info) {
		return Object.keys(info).reduce((measurements, key) => {
			const measurementType = this._mapMeasurementType(key);

			if (measurementType !== AbstractPlatform.MeasurementType.UNSUPPORTED) {
				const measurementInfo = info[key];
				const measurement = new MeasurementModel({
					type: measurementType,
					info: measurementInfo,
				});

				measurements.push(measurement);
			}

			return measurements;
		}, []);
	}

	_extractCapabilities(info) {
		return Object.keys(info).reduce((capabilities, key) => {
			const capabilityType = this._mapCapabilityType(key);

			if (capabilityType !== AbstractPlatform.CapabilityType.UNSUPPORTED) {
				const capabilityInfo = info[key];
				const capability = new CapabilityModel({
					type: capabilityType,
					info: capabilityInfo,
				});

				capabilities.push(capability);
			}

			return capabilities;
		}, []);
	}

	_mapManagedObjectToDevice(info) {
		const mappedDevice = new DeviceModel({
			id: info.id,
			name: info.name,
			type: info.type ? info.type : null,
			serial: info.c8y_Hardware && info.c8y_Hardware.serialNumber ? info.c8y_Hardware.serialNumber : null,
			model: info.c8y_Hardware
				? info.c8y_Hardware.model
				: null,
			isOnline: info.c8y_Availability && info.c8y_Availability.status
				? info.c8y_Availability.status === 'AVAILABLE'
				: false,
			childDevices: info.childDevices ? info.childDevices.references.map(this._mapChildDevice.bind(this)) : [],
			supportedOperations: info.c8y_SupportedOperations ? info.c8y_SupportedOperations : [],
			capabilities: this._extractCapabilities(info),
		});

		return mappedDevice;
	}

	_mapCapabilityType(type) {
		if (typeof KaaPlatform.capabilityTypeMapping[type] === 'undefined') {
			return AbstractPlatform.CapabilityType.UNSUPPORTED;
		}

		return KaaPlatform.capabilityTypeMapping[type];
	}

	_mapMeasurementType(type) {
		if (typeof KaaPlatform.measurementTypeMapping[type] === 'undefined') {
			return AbstractPlatform.MeasurementType.UNSUPPORTED;
		}

		return KaaPlatform.measurementTypeMapping[type];
	}

	_mapChildDevice(info) {
		return this._mapManagedObjectToDevice(info.managedObject);
	}

	_getNextRealtimeId() {
		return this._realtimeId++;
	}

	_buildUrl(query) {
		const authenticationInfo = this.store.getState().authentication.info;

		return `${this.network.protocol}://${authenticationInfo.tenant}.${this.network.host}/${query}`;
	}

	_getStandardRequestParameters() {
		const authenticationInfo = this.store.getState().authentication.info;

		return {
			auth: {
				username: authenticationInfo.username,
				password: authenticationInfo.password,
			},
		};
	}

	_formatDate(date = new Date()) {
		return date.toISOString().substr(0, 10);
	}

	_getTomorrowsDate() {
		return new Date(Date.now() + (24 * 60 * 60 * 1000));
	}

}
