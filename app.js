import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import thunkMiddleware from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import promiseMiddleware from 'redux-loading-promise-middleware';
import platformManager from './services/platform-manager';
import platformApi from './apis/platform-api';
import getRoutes from './config/routes';
import * as reducers from './reducers';

// configure combined reduxer which includes the router
const reducer = combineReducers({
	...reducers,
	routing: routerReducer,
});

// configure dev-tools
const DevTools = createDevTools(
	<DockMonitor
		toggleVisibilityKey="ctrl-h"
		changePositionKey="ctrl-j"
		changeMonitorKey="ctrl-m"
		defaultIsVisible={false}
	>
		<LogMonitor theme="tomorrow" preserveScrollTop={false} />
		<SliderMonitor />
	</DockMonitor>
);

// configure the store with appopriate middlewares
const store = createStore(
	reducer,
	compose(
		applyMiddleware(thunkMiddleware),
		applyMiddleware(promiseMiddleware),
		DevTools.instrument()
	)
);

// configure router history
const history = syncHistoryWithStore(browserHistory, store);

// use tap events
injectTapEventPlugin({
	shouldRejectClick: (lastTouchEventTimestamp, clickEventTimestamp) => {
		const diff = clickEventTimestamp - lastTouchEventTimestamp;

		return diff < 2000;
	},
});

// provide store to platform api
platformApi.setStore(store);

// render the application
ReactDOM.render(
	<Provider store={store}>
		<div>
			<Router history={history} routes={getRoutes(store)} />
			<DevTools />
		</div>
	</Provider>,
	document.getElementById('root')
);

// for debugging only
window.app = {
	...window.app || {},
	store,
	reducer,
	history,
	platformApi,
	platformManager,
};
