import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import * as menuActions from '../../actions/menu-actions';

class DrawerMenuComponent extends Component {

	static propTypes = {
		menu: PropTypes.object.isRequired,

		openMainMenu: PropTypes.func.isRequired,
		closeMainMenu: PropTypes.func.isRequired,
	}

	render() {
		return (
			<Drawer
				onRequestChange={this.handleDrawerChange.bind(this)}
				open={this.props.menu.isOpen}
				docked={false}
				disableSwipeToOpen={false}
				className="drawer-menu-component"
			>
				<AppBar
					title="Menu"
					className="app-bar"
					iconElementLeft={this.renderIconElementLeft()}
				/>
				<MenuItem onTouchTap={this.handleOpen('devices')}>Devices</MenuItem>
			</Drawer>
		);
	}

	renderIconElementLeft() {
		return (
			<IconButton onTouchTap={() => this.handleClose()}>
				<NavigationClose />
			</IconButton>
		);
	}

	handleDrawerChange(isOpen, reason) {
		if (isOpen) {
			this.props.openMainMenu();
		} else {
			this.props.closeMainMenu();
		}
	}

	handleOpen(view) {
		return () => {
			this.props.closeMainMenu();

			browserHistory.push(`/${view}`);
		};
	}

	handleClose() {
		this.props.closeMainMenu();
	}
}

export default connect(
	state => ({
		menu: state.menu,
	}), {
		...menuActions,
	}
)(DrawerMenuComponent);
