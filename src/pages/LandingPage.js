import React, { Component } from 'react';
import MyNavbar from '../components/MyNavbar';
import MyButton from '../components/MyButton';
import ErrorFlash from '../components/ErrorFlash';
import { Row, Col, Form } from 'react-bootstrap';
import auth from '../auth';
import './styles/LandingPage.css';

export class LandingPage extends Component {

	state = {
		error: "",
		user: {
			email: '',
			password: '',
		}
	}

	login = async (user) => {
		await auth.login(
			user,
			res => {
				this.setState({ error: "" });
				this.props.history.push('/dashboard');
			},
			err => {
				this.setState({ error: "Unable to authenticate" });
			}
		)
	}

	onChange = async (e) => {
		let user = this.state.user;
		user[e.target.name] = e.target.value;
		this.setState({ user });
	}

	onSubmit = async (e) => {
		e.preventDefault();
		this.login(this.state.user);
	}

	componentDidMount = async () => {
		if (auth.isAuthenticated())
			await auth.logout();
	}

	render() {
		return (
			<div>
				<MyNavbar absolute={true} history={this.props.history} />

				<div className="clipped bg-red"></div>

				<Row>
					<Col>
						<div className="section">
							<img src="http://quomodosoft.com/html/lunatic/lunatic/images/mobile-1.png" alt="iphone" />
						</div>
					</Col>
					<Col>
						<div className="section">
							<div>
								<span className="title">Giggz &mdash; Appointments made seamless.</span> <br />
								<span className="title sub-title">We bring you the customers you deserve.</span>
							</div>
						</div>
					</Col>
				</Row>

				<Row>
					<Col></Col>
					<Col>
						
						<div style={{padding: "5em"}}>
							<ErrorFlash message={this.state.error} />
							<Form onSubmit={this.onSubmit}>
								<Form.Group controlId="formBasicEmail">
									<Form.Control type="email" name="email" value={this.state.user.email} placeholder="Enter email" onChange={this.onChange}/>
								</Form.Group>

								<Form.Group controlId="formBasicPassword">
									<Form.Control type="password" name="password" value={this.state.user.password} placeholder="Password" onChange={this.onChange}/>
								</Form.Group>
								<MyButton variant="primary" size="sm" type="submit" text="Login" />
							</Form>
						</div>
					</Col>
				</Row>

				{/* <div className="section">
					
				</div> */}
				
				{/* <section className="section section-slope-down bg-red">
					<div className="flex-elem right">
						<span className="title">Giggz &mdash; Appointments made seamless.</span>
						<span className="title sub-title">We bring you the customers you deserve.</span>
					</div>	
				</section>
				<section className="section">

				</section> */}
				{/* <section className="section section-slope-up bg-red">
				</section> */}

			</div>
		)
	}
}

export default LandingPage;