import AbstractPlatform from '../src/AbstractPlatform';
import AbstractModel from '../src/AbstractModel';

export default class MeasurementModel extends AbstractModel {

	getSchema() {
		return {
			type: Object.keys(AbstractPlatform.MeasurementType),
			info: Object,
		};
	}

}
