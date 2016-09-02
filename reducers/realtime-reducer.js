import { handleActions } from 'redux-actions';
import { getDefaultAsyncState } from 'redux-loading-promise-middleware';
import { GET_REALTIME_UPDATES } from '../config/constants';

const defaultState = getDefaultAsyncState();

export default handleActions({
	[GET_REALTIME_UPDATES]: (state, action) => ({
		...state,
		...action.payload,
	}),
}, defaultState);
