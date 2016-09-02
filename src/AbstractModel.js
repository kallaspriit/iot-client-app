import schemaValidator from 'js-schema';

export default class AbstractModel {

	constructor({
		...args,
	}) {
		const schema = this.getSchema();

		Object.assign(this, Object.keys(schema).reduce((obj, key) => {
			obj[key] = typeof args[key] !== 'undefined' ? args[key] : undefined; // eslint-disable-line

			return obj;
		}, {}));

		this.validate();
	}

	validate() {
		if (typeof this.getSchema !== 'function') {
			throw new Error('Define getSchema() for your model');
		}

		const schema = this.getSchema();
		const validator = schemaValidator(schema);

		if (!validator(this)) {
			const errors = validator.errors(this);

			console.error('model validation failed', errors, this, schema);

			throw new Error(`Model validation failed (${this._formatValidationErrors(errors)})`);
		}
	}

	_formatValidationErrors(errors) {
		return Object.keys(errors).map((key) => `${key} - ${errors[key]}`).join(', ');
	}

}
