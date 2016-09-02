import platformApi from '../apis/platform-api';

export default class PlatformManager {

	constructor() {
		this.platforms = [];
		this.activePlatform = null;
	}

	addPlatform(platform) {
		this.platforms.push(platform);

		if (this.activePlatform === null) {
			this.setActivePlatform(platform.getName());
		}
	}

	getPlatforms() {
		return this.platforms;
	}

	getPlatformByName(name) {
		return this.platforms.find((platform) => platform.getName() === name) || null;
	}

	getActivePlatform() {
		return this.activePlatform;
	}

	setActivePlatform(platformName) {
		const platform = this.getPlatformByName(platformName);

		if (!platform) {
			throw new Error(`Platform called ${platformName} does not exist`);
		}

		this.activePlatform = platform;

		platformApi.setProvider(platform);
	}


}
