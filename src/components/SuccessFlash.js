import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';

export class SuccessFlash extends Component {

	gen_alert = () => {
		if (this.props.message.length === 0) return null;
		return (
			<Alert variant="success">
				{this.props.message}
			</Alert>
		);
	}

	render() {
		return (
			<React.Fragment>
				{this.gen_alert()}
			</ React.Fragment>
		)
	}
}

export default SuccessFlash;
