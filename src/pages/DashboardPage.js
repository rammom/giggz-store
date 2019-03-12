import React, { Component } from 'react';

import MyNavbar from '../components/MyNavbar';

export class DashboardPage extends Component {
	render() {
		return (
			<div>
				<MyNavbar absolute={false} color={"#dd0000"} history={this.props.history} />
				Dashboard Page
			</div>
		)
	}
}

export default DashboardPage;