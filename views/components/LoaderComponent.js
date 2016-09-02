import React, { Component } from 'react';

import CircularProgress from 'material-ui/CircularProgress';

export default class LoaderComponent extends Component {

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return (
			<div className="loader-component">
				<CircularProgress />
			</div>
		);
	}

}
