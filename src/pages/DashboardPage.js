import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import MyNavbar from '../components/MyNavbar';
import Calendar from '../components/Calendar/Calendar';
import axios from 'axios';
import EmployeeFunctions from '../components/EmployeeFunctions';

export class DashboardPage extends Component {

	state = {
		employee: {
			hours: [],
			appointments: [],
		},
		functions: {
			calendar_view: "week"
		}
	}

	async componentDidMount() {

		// get the user's employee object
		await axios.get(`${process.env.REACT_APP_GIGGZ_API}/api/employee`)
			.then(res => {
				console.log(res);
				this.setState({ employee: res.data.employee })
			})
			.catch(err => {
				console.log(err);
			});

	}

	setCalendarView = (view) => {
		let functions = this.state.functions;
		functions.calendar_view = view;
		this.setState({ functions });
	}

	showAppointment = (appt) => {
		console.log(appt);
	}

	render() {
		return (
			<div>
				<MyNavbar absolute={false} color={"#dd0000"} history={this.props.history} />
				<div style={Container}>
					<Row>
						<Col lg="4">
							<EmployeeFunctions
								employee={this.state.employee}
								functions={this.state.functions}
								setCalendarView={this.setCalendarView}
							/>
						</Col>
						<Col>
							<Calendar
								employee_view
								availability={this.state.employee.hours}
								appointments={this.state.employee.appointments.map(appt => {
									return {
										datetime: new Date(appt.datetime),
										customer: appt.user,
										length: appt.service.length,
										service: appt.service,
									}
								})}
								view={this.state.functions.calendar_view}
								showAppointment={this.showAppointment}
							/>
						</Col>
					</Row>
				</div>
			</div>
		)
	}
}

const Container = {
	margin: "5em"
}

export default DashboardPage;