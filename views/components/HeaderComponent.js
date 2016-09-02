import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';

import * as menuActions from '../../actions/menu-actions';

class HeaderComponent extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
		menus: PropTypes.array,

		openMainMenu: PropTypes.func.isRequired,
	};

	static defaultProps = {
		menus: [],
	};

	static contextTypes = {
		canGoBack: React.PropTypes.func.isRequired,
	};

	render() {
		return (
			<AppBar
				title={this.props.title}
				iconElementLeft={this.renderIconElementLeft()}
				iconElementRight={this.renderIconElementRight()}
				className="header-component"
			/>
		);
	}

	renderIconElementLeft() {
		const canGoBack = this.context.canGoBack();

		if (!canGoBack) {
			return (
				<IconButton onTouchTap={() => this.handleOpenMenu()}>
					<ArrowForwardIcon />
				</IconButton>
			);
		}

		return (
			<IconButton onTouchTap={() => this.handleBack()}>
				<ArrowBackIcon />
			</IconButton>
		);
	}

	renderIconElementRight() {
		if (this.props.menus.length === 0) {
			return null;
		}

		const menuOrigin = {
			horizontal: 'right',
			vertical: 'top',
		};

		return (
			<IconMenu
				iconButtonElement={
					<IconButton><MoreVertIcon /></IconButton>
				}
				targetOrigin={menuOrigin}
				anchorOrigin={menuOrigin}
			>
				{this.props.menus}
			</IconMenu>
		);
	}

	handleOpenMenu() {
		this.props.openMainMenu();
	}

	handleBack() {
		browserHistory.goBack();
	}

	handleOpen(view) {
		return () => {
			browserHistory.push(`/${view}`);
		};
	}

}

export default connect(
	state => ({}), {
		...menuActions,
	}
)(HeaderComponent);
