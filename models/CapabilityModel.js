import AbstractModel from '../src/AbstractModel';
import AbstractPlatform from '../src/AbstractPlatform';

export default class CapabilityModel extends AbstractModel {

	getSchema() {
		return {
			type: Object.keys(AbstractPlatform.CapabilityType),
			info: Object,
		};
	}

}
