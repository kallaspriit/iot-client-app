import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import keyMirror from 'keymirror';
import changeCase from 'change-case';

export default class MessageComponent extends Component {

	static Type = keyMirror({
		SUCCESS: null,
		ERROR: null,
	});

	static propTypes = {
		type: PropTypes.string,
		message: PropTypes.string,
		isVisible: PropTypes.bool,
	};

	static defaultProps = {
		type: MessageComponent.Type.SUCCESS,
		message: 'Something went wrong',
		isVisible: true,
	};

	render() {
		const className = classNames({
			'message-component': true,
			[`type-${changeCase.paramCase(this.props.type)}`]: true,
			'is-visible': this.props.isVisible,
		});

		return (
			<div className={className}>
				{this.props.message}
			</div>
		);
	}

}
