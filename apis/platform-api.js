import AbstractPlatform from '../src/AbstractPlatform';

export class PlatformApi extends AbstractPlatform {

	constructor() {
		super();

		this.provider = null;
	}

	setStore(store) {
		super.setStore(store);

		if (this.provider !== null) {
			this.provider.setStore(store);
		}
	}

	setProvider(provider) {
		this.provider = provider;
		provider.setStore(this.config);

		this._setupProxy();
	}

	getDevices() {
		return this.provider.getDevices();
	}

	_getProviderMethodNames() {
		return Object.getOwnPropertyNames(Object.getPrototypeOf(this.provider));
	}

	_getExpectedMethodNames() {
		return Object.getOwnPropertyNames(AbstractPlatform.prototype).filter(
			this._isProxiedMethodName
		);
	}

	_isProxiedMethodName(methodName) {
		if (methodName.substr(0, 1) === '_') {
			return false;
		}

		if (['constructor', 'setStore'].indexOf(methodName) !== -1) {
			return false;
		}

		return true;
	}

	_setupProxy() {
		const proxiedMethodNames = [];
		const expectedMethodNames = this._getExpectedMethodNames();

		this._getProviderMethodNames().forEach((methodName) => {
			if (!this._isProxiedMethodName(methodName)) {
				return;
			}

			this[methodName] = (...args) => this.provider[methodName](...args);

			proxiedMethodNames.push(methodName);
		});

		this._verifyAbstractPlatformImplemented(proxiedMethodNames, expectedMethodNames);
	}

	_verifyAbstractPlatformImplemented(proxiedMethodNames, expectedMethodNames) {
		expectedMethodNames.forEach((expectedMethodName) => {
			if (proxiedMethodNames.indexOf(expectedMethodName) === -1) {
				throw new Error(`Expected platform provider to implement "${expectedMethodName}"`);
			}
		});

		proxiedMethodNames.forEach((proxiedMethodName) => {
			if (expectedMethodNames.indexOf(proxiedMethodName) === -1) {
				throw new Error(`Expected abstract platform to include "${proxiedMethodName}"`);
			}
		});
	}
}

export default new PlatformApi();
