import { handleActions } from 'redux-actions';
import { OPEN_MAIN_MENU, CLOSE_MAIN_MENU } from '../config/constants';

const defaultState = {
	isOpen: false,
};

export default handleActions({
	[OPEN_MAIN_MENU]: (state, action) => ({
		isOpen: true,
	}),
	[CLOSE_MAIN_MENU]: (state, action) => ({
		isOpen: false,
	}),
}, defaultState);
