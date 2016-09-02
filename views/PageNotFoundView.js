import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';

import HeaderComponent from './components/HeaderComponent';

class EmptyView extends Component {
	render() {
		return (
			<div className="page-not-found-view">
				<HeaderComponent title="404 - invalid url" />
				<Card className="main-contents">
					<CardText>
						Page not found
					</CardText>
				</Card>
			</div>
		);
	}
}

export default connect(
	state => ({}),
	{}
)(EmptyView);
