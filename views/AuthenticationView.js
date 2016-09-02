import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Card from 'material-ui/Card/Card';
import CardTitle from 'material-ui/Card/CardTitle';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import HeaderComponent from './components/HeaderComponent';
import MessageComponent from './components/MessageComponent';

import * as platformActions from '../actions/platform-actions';

class AuthenticationView extends Component {

	static propTypes = {
		authentication: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,

		setCredentials: PropTypes.func.isRequired,
		authenticate: PropTypes.func.isRequired,
		logout: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			tenant: props.authentication.info.tenant,
			username: props.authentication.info.username,
			password: props.authentication.info.password,
		};

		this.isRedirecting = false;
	}

	componentDidMount() {
		this.checkForAutomaticLogin();
	}

	componentDidUpdate() {
		this.checkForAuthenticationSuccessful();
	}

	render() {
		const {
			authentication,
		} = this.props;

		const isLoading = authentication.isLoading;
		const isLoggedIn = authentication.info.isLoggedIn;
		const isFormDisabled = isLoading || isLoggedIn;
		const loaderStyle = {
			visibility: isLoading || isLoggedIn ? 'visible' : 'hidden',
		};

		return (
			<div className="authentication-view">
				<HeaderComponent title="Authentication" />
				<Card className="main-contents">
					<CardMedia
						overlay={
							<CardTitle
								title="Login"
								subtitle="Authenticate using your credentials"
							/>
						}
					>
						<img
							src="/gfx/images/authentication-background.jpg"
							alt="Login"
						/>
					</CardMedia>
					<LinearProgress mode="indeterminate" style={loaderStyle} />
					<CardText>
						{this.renderMessage()}
						<TextField
							id="tenant"
							hintText="Tenant"
							fullWidth
							disabled={isFormDisabled}
							value={this.state.tenant}
							onChange={(event) => this.handleTextFieldChange(event)}
						/>
						<TextField
							id="username"
							hintText="Username"
							fullWidth
							disabled={isFormDisabled}
							value={this.state.username}
							onChange={(event) => this.handleTextFieldChange(event)}
						/>
						<TextField
							id="password"
							hintText="Password"
							type="password"
							fullWidth
							disabled={isFormDisabled}
							value={this.state.password}
							onChange={(event) => this.handleTextFieldChange(event)}
						/>
						<RaisedButton
							label="Login"
							className="login-button"
							primary
							fullWidth
							disabled={isFormDisabled}
							onTouchTap={() => this.handleLogin()}
						/>
						{this.renderForgetButton()}
					</CardText>
				</Card>
			</div>
		);
	}

	renderMessage() {
		const {
			authentication,
		} = this.props;

		const messageProps = {
			type: MessageComponent.Type.ERROR,
			message: '',
			isVisible: false,
		};

		if (authentication.info.isLoggedIn) {
			messageProps.type = MessageComponent.Type.SUCCESS;
			messageProps.message = 'Authentication successful';
			messageProps.isVisible = true;
		} else if (authentication.info.isInvalidCredentials) {
			messageProps.type = MessageComponent.Type.ERROR;
			messageProps.message = 'Invalid credentials, please try again';
			messageProps.isVisible = true;
		}

		return <MessageComponent {...messageProps} />;
	}

	renderForgetButton() {
		if (!this.props.authentication.info.isRemembered) {
			return null;
		}

		return (
			<FlatButton
				label="Forget user"
				className="forget-button"
				onTouchTap={() => this.handleLogout()}
			/>
		);
	}

	handleLogin() {
		this.props.setCredentials(
			this.state.tenant,
			this.state.username,
			this.state.password,
		);

		this.props.authenticate();
	}

	handleLogout() {
		this.props.logout();

		this.setState({
			tenant: '',
			username: '',
			password: '',
		});
	}

	handleTextFieldChange(event) {
		this.setState({
			[event.target.id]: event.target.value,
		});
	}

	checkForAuthenticationSuccessful() {
		if (this.props.authentication.info.isLoggedIn && !this.isRedirecting) {
			this.isRedirecting = true;

			let nextPathname = '/devices';

			if (this.props.location.state !== null && this.props.location.state.nextPathname) {
				nextPathname = this.props.location.state.nextPathname;
			}

			setTimeout(() => {
				browserHistory.replace(nextPathname);
			}, 1000);
		}
	}

	checkForAutomaticLogin() {
		if (this.state.tenant.length > 0 && this.state.username.length > 0 && this.state.password.length > 0) {
			this.handleLogin();
		}
	}
}

export default connect(
	state => ({
		authentication: state.authentication,
	}), {
		...platformActions,
	}
)(AuthenticationView);
