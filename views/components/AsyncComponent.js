import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import LoaderComponent from './LoaderComponent';
import ErrorComponent from './ErrorComponent';

class AsyncComponent extends Component {

	static propTypes = {
		info: PropTypes.object,
		children: PropTypes.object,
		render: PropTypes.func,
	};

	render() {
		const {
			info,
			children,
			render,
		} = this.props;

		if (info.error) {
			return <ErrorComponent error={info.error} />;
		} else if (info.isLoading || !info.info) {
			return <LoaderComponent />;
		} else if (typeof render === 'function') {
			return render(info.info);
		}

		return children;
	}

}

export default connect(
	state => ({
	}), {
	}
)(AsyncComponent);
