import PlatformManager from '../src/PlatformManager';
import platforms from '../config/platforms-config';

const platformManager = new PlatformManager();

platforms.forEach((platform) => platformManager.addPlatform(platform));

export default platformManager;
