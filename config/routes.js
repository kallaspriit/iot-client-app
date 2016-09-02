import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import RootView from '../views/RootView';
import AuthenticationView from '../views/AuthenticationView';
import DevicesView from '../views/DevicesView';
import DeviceView from '../views/DeviceView';
import PageNotFoundView from '../views/PageNotFoundView';

function requireAuthentication(nextState, replace, store) {
	const authenticationInfo = store.getState().authentication.info;
	const isLoggedIn = authenticationInfo.isLoggedIn;

	if (!isLoggedIn) {
		replace({
			pathname: '/authentication',
			state: {
				nextPathname: nextState.location.pathname,
			},
		});
	}
}

export default function(store) {
	const handleRequireAuthentication = (nextState, replace) => requireAuthentication(nextState, replace, store);

	return [
		<Route path="/" component={RootView}>
			<Route path="authentication" component={AuthenticationView} />
			<Route path="devices" component={DevicesView} onEnter={handleRequireAuthentication} />
			<Route path="devices/:deviceId" component={DeviceView} onEnter={handleRequireAuthentication} />
			<Route path="*" component={PageNotFoundView} />
			<IndexRedirect to="devices" />
		</Route>,
	];
}
