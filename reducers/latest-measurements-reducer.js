import { handleActions } from 'redux-actions';
import { getDefaultAsyncState } from 'redux-loading-promise-middleware';
import { GET_DEVICE_LATEST_MEASUREMENTS } from '../config/constants';

const defaultState = {
	...getDefaultAsyncState(),
	info: {},
};

export default handleActions({
	[GET_DEVICE_LATEST_MEASUREMENTS]: (state, action) => ({
		...state,
		...action.payload,
	}),
}, defaultState);
