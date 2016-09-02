import { handleActions } from 'redux-actions';
import { getDefaultAsyncState } from 'redux-loading-promise-middleware';
import { GET_MEASUREMENT_SERIES } from '../config/constants';

const defaultState = {
	...getDefaultAsyncState(),
	info: {},
};

export default handleActions({
	[GET_MEASUREMENT_SERIES]: (state, action) => ({
		...state,
		...action.payload,
	}),
}, defaultState);
