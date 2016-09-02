import PlatformManager from '../src/PlatformManager';
import CumulocityPlatform from '../src/CumulocityPlatform';
import KaaPlatform from '../src/KaaPlatform';

const platformManager = new PlatformManager();

platformManager.addPlatform(new CumulocityPlatform());
platformManager.addPlatform(new KaaPlatform());

export default platformManager;
