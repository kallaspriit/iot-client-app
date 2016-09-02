import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import StackTrace from 'stacktrace-js';

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Card from 'material-ui/Card/Card';
import CardMedia from 'material-ui/Card/CardMedia';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';
import CircularProgress from 'material-ui/CircularProgress';

class ErrorComponent extends Component {

	static propTypes = {
		error: PropTypes.object,
		message: PropTypes.string,
	};

	state = {
		isTraceLoading: false,
		trace: [],
	};

	componentWillMount() {
		const { error } = this.props;

		if (error) {
			this.setState({
				isTraceLoading: true,
			});
		}
	}

	componentDidMount() {
		const { error } = this.props;

		if (error) {
			StackTrace.fromError(error).then((trace) => {
				this.setState({
					trace,
					isTraceLoading: false,
				});
			});
		}
	}

	render() {
		const message = this.props.message ? this.props.message : this.props.error.message;

		return (
			<div className="error-component">
				<Card className="main-contents">
					<CardMedia
						overlay={
							<CardTitle
								title="Error occured"
								subtitle="Try reloading the application"
							/>
						}
					>
						<img
							src="/gfx/images/error-background.jpg"
							alt="Error occured"
						/>
					</CardMedia>
					<CardText>
						<strong>{message}</strong>
						{this.renderTrace()}
					</CardText>
				</Card>
			</div>
		);
	}

	renderTrace() {
		if (this.state.isTraceLoading) {
			return (
				<div className="trace-progress-wrap">
					<CircularProgress />
				</div>
			);
		} else if (this.state.trace.length > 0) {
			return (
				<List>
					{this.state.trace.map((item, index) => this.renderTraceItem(item, index))}
				</List>
			);
		}

		return null;
	}

	renderTraceItem(item, index) {
		return (
			<ListItem
				key={index}
				primaryText={`${this.formatFilename(item.fileName)}:${item.lineNumber}`}
				secondaryText={item.functionName}
			/>
		);
	}

	formatFilename(filename) {
		return filename.replace('webpack:///', '');
	}

}

export default connect(
	state => ({
	}), {
	}
)(ErrorComponent);
