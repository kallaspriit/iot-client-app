import { handleActions } from 'redux-actions';
import store from 'store';
import keyMirror from 'keymirror';
import { getDefaultAsyncState } from 'redux-loading-promise-middleware';
import { SET_CREDENTIALS, AUTHENTICATE, LOGOUT } from '../config/constants';

const StoreKey = keyMirror({
	AUTHENTICATION_TENANT: null,
	AUTHENTICATION_USERNAME: null,
	AUTHENTICATION_PASSWORD: null,
	AUTHENTICATION_REMEMBERED: null,
});

const defaultState = {
	...getDefaultAsyncState(),
	info: {
		tenant: store.get(StoreKey.AUTHENTICATION_TENANT, ''),
		username: store.get(StoreKey.AUTHENTICATION_USERNAME, ''),
		password: store.get(StoreKey.AUTHENTICATION_PASSWORD, ''),
		isRemembered: store.get(StoreKey.AUTHENTICATION_REMEMBERED, false),
		isLoggedIn: false,
		isInvalidCredentials: false,
	},
};

export default handleActions({
	[SET_CREDENTIALS]: (state, action) => ({
		...state,
		...action.payload,
	}),
	[AUTHENTICATE]: (state, action) => {
		const isLoggedIn = !action.payload.isLoading && action.payload.error === null;
		const isInvalidCredentials = action.payload.error !== null;

		if (isLoggedIn) {
			store.set(StoreKey.AUTHENTICATION_TENANT, state.info.tenant);
			store.set(StoreKey.AUTHENTICATION_USERNAME, state.info.username);
			store.set(StoreKey.AUTHENTICATION_PASSWORD, state.info.password);
			store.set(StoreKey.AUTHENTICATION_REMEMBERED, true);
		}

		return {
			...state,
			isLoading: action.payload.isLoading,
			info: {
				...state.info,
				isLoggedIn,
				isInvalidCredentials,
			},
		};
	},
	[LOGOUT]: (state, action) => {
		store.remove(StoreKey.AUTHENTICATION_TENANT);
		store.remove(StoreKey.AUTHENTICATION_USERNAME);
		store.remove(StoreKey.AUTHENTICATION_PASSWORD);
		store.remove(StoreKey.AUTHENTICATION_REMEMBERED);

		return {
			...state,
			info: {
				tenant: '',
				username: '',
				password: '',
				isRemembered: false,
				isLoggedIn: false,
				isInvalidCredentials: false,
			},
		};
	},
}, defaultState);
