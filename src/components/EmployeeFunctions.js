import React, { Component } from 'react';
import { Card, Form } from 'react-bootstrap';

class EmployeeFunctions extends Component {

	changeCalendarView = (e) => {
		this.props.setCalendarView(e.target.value);
	}

	render() {
		return (
			<div style={{height: "100%"}}>
				<Card style={{height: "100%"}}>
					<Card.Body>
						<h4>Functions.</h4>
						<hr />
						<Form>
							<Form.Label>Calendar View</Form.Label>
							<Form.Control as="select" value={this.props.functions.calendar_view} onChange={this.changeCalendarView}>
								{/* <option value="day">Daily</option> */}
								<option value="week">Weekly</option>
							</Form.Control>
						</Form>
					</Card.Body>
				</Card>
			</div>
		)
	}
}

export default EmployeeFunctions;