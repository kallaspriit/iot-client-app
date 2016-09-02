import AbstractModel from '../src/AbstractModel';
import CapabilityModel from './CapabilityModel';

export default class DeviceModel extends AbstractModel {

	getSchema() {
		return {
			id: String,
			name: String,
			type: [String, null],
			serial: [String, null],
			model: [String, null],
			isOnline: Boolean,
			childDevices: Array.of(DeviceModel),
			supportedOperations: Array.of(String),
			capabilities: Array.of(CapabilityModel),
		};
	}

}
