import CumulocityPlatform from '../src/CumulocityPlatform';
import KaaPlatform from '../src/KaaPlatform';

import cumulocityConfig from '../config/cumulocity-config';
import kaaConfig from '../config/kaa-config';

export default [
	new CumulocityPlatform(cumulocityConfig),
	new KaaPlatform(kaaConfig),
];
