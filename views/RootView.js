import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import themeConfig from '../config/theme-config';

import DrawerMenuComponent from './components/DrawerMenuComponent';

// require stylesheet
require('../gfx/css/main.scss');

// setup theme
const muiTheme = getMuiTheme(themeConfig);

// root view
export default class RootView extends Component {

	static propTypes = {
		children: PropTypes.object,
		location: PropTypes.object.isRequired,
	};

	static childContextTypes = {
		canGoBack: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			canGoBack: false,
			history: [],
		};
	}

	getChildContext() {
		return {
			canGoBack: () => this.state.canGoBack,
		};
	}

	componentWillReceiveProps(nextProps) {
		this.handleHistoryChange(nextProps);
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div className="top-wrap">
					{this.props.children}
					<DrawerMenuComponent />
				</div>
			</MuiThemeProvider>
		);
	}

	handleHistoryChange(nextProps) {
		if (nextProps.location !== this.props.location) {
			const newHistory = [
				...this.state.history,
			];

			switch (nextProps.location.action) {
				case 'PUSH':
					newHistory.push(nextProps.location.pathname);
					break;

				case 'POP':
					newHistory.pop();
					break;

				case 'REPLACE':
					newHistory.pop();
					break;

				default:
					console.warn(`unexpected location action ${nextProps.location.action}`);
			}

			this.setState({
				canGoBack: newHistory.length > 0,
				history: newHistory,
			});
		}
	}
}
