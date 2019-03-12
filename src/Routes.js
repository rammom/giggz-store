import React, { Component } from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import auth from './auth';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';


const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={(props) => (
		auth.isAuthenticated() === true
			? <Component {...props} />
			: <Redirect to='/' />
	)} />
);

const UnAuthenticatedRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={(props) => (
		auth.isAuthenticated() === false
			? <Component {...props} />
			: <Redirect to='/dashboard' />
	)} />
);


export class Routes extends Component {
	
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<UnAuthenticatedRoute exact path="/" component={LandingPage} />
					<PrivateRoute exact path="/dashboard" component={DashboardPage} />

					<Route exact path="*">
						<Redirect to="/" />
					</Route>
				</Switch>
			</BrowserRouter>
		)
	}
}

export default Routes;
