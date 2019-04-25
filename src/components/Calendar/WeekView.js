import React, { Component } from 'react';
import './Calendar.css';
import dateFns from 'date-fns';
import utils from '../../utils';

export class WeekView extends Component {

	state = {
		startTime: null,
		endTime: null,
		appointments: {},
		appointmentBlocks: {},
		mouseOverBlock: new Set(),
		mouseOver: null,
	}

	componentDidUpdate(oldProps) {

		if (this.props.availability && oldProps.availability !== this.props.availability) {
			let startHour = 25;
			let endHour = -1;
			utils.weekdays.forEach(day => {
				startHour = Math.min(startHour, utils.minutes_to_time(this.props.availability[day][0].start).hours);
				endHour = Math.max(endHour, utils.minutes_to_time(this.props.availability[day][this.props.availability[day].length - 1].end).hours);
			});
			let date = dateFns.startOfWeek(this.props.currentMonth);
			date = dateFns.startOfDay(date);
			this.setState({ startTime: dateFns.setHours(date, startHour) })
			this.setState({ endTime: dateFns.setHours(date, endHour) })
		}
		
		if (this.props.appointments && oldProps.appointments !== this.props.appointments){

			// format appointments per day
			let appointments = {};
			this.props.appointments.forEach(appt => {
				let date_index = dateFns.getDayOfYear(appt.datetime);
				if (appointments[date_index]) appointments[date_index].push(appt);
				else appointments[date_index] = [appt];
			});
			this.setState({ appointments });

			// create appointment blocks
			let appointmentBlocks = this.state.appointmentBlocks;
			this.props.appointments.forEach(appt => {
				let date_format = "MM/DD/YYYY H:mm:ss";
				let length = appt.length;
				let datetime = appt.datetime;
				let block_slots = [];
				while(length > 0){
					block_slots.push(dateFns.format(datetime, date_format));
					datetime = dateFns.addMinutes(datetime, this.props.interval);
					length -= this.props.interval;
				}
				appointmentBlocks[dateFns.format(appt.datetime, date_format)] = block_slots;
			})
			this.setState({ appointmentBlocks });

		}
	}

	getParentDate(datetime) {
		let date_format = "MM/DD/YYYY H:mm:ss";
		let cloneTime = new Date(datetime);
		let apptBlock = this.state.appointmentBlocks[dateFns.format(cloneTime, date_format)]
		if (apptBlock) {
			return apptBlock[0]
		} 
		while (!this.state.appointmentBlocks[dateFns.format(cloneTime, date_format)]) {
			if (dateFns.isAfter(this.state.startTime, cloneTime)) return null;
			cloneTime = dateFns.subMinutes(cloneTime, this.props.interval);
		}
		apptBlock = this.state.appointmentBlocks[dateFns.format(cloneTime, date_format)];
		if (apptBlock) return apptBlock[0];
		return null;
	}

	getAppointment(datetime) {
		let formattedDate = this.getParentDate(datetime);
		let date_format = "MM/DD/YYYY H:mm:ss";
		for (let i = 0; i < this.props.appointments.length; ++i) {
			if (dateFns.format(this.props.appointments[i].datetime, date_format) === formattedDate){
				return this.props.appointments[i];
			}
		}
		// not found

	}

	isPast(datetime) {
		let now = new Date();
		if (datetime - now < 0) return true;
		if (dateFns.isPast(datetime)) return true;
	}

	isFirstSlotInAppointment(datetime) {
		let date_format = "MM/DD/YYYY H:mm:ss";
		if (this.state.appointmentBlocks[dateFns.format(datetime, date_format)]) return true;
		return false;
	}
	isSecondSlotInAppointment(datetime) {
		if (this.isFirstSlotInAppointment(datetime)) return false;
		let cloneTime = dateFns.subMinutes(datetime, this.props.interval);
		let date_format = "MM/DD/YYYY H:mm:ss";
		let apptBlocks = this.state.appointmentBlocks[dateFns.format(cloneTime, date_format)];
		if (!apptBlocks) return false;
		if (!(apptBlocks[1] === dateFns.format(datetime, date_format))) return false;
		return true;
	}

	// MAKE SURE GIVEN DATETIME IS IN AN APPOINTMENT
	isLastSlotInAppointment(datetime) {
		let date_format = "MM/DD/YYYY H:mm:ss";
		let cloneTime = new Date(datetime);
		let apptBlock = this.state.appointmentBlocks[dateFns.format(cloneTime, date_format)]
		if (apptBlock){
			if (apptBlock.length === 1) return true;
			return false;
		} 

		while ( !this.state.appointmentBlocks[dateFns.format(cloneTime, date_format)]){
			if (dateFns.isAfter(this.state.startTime, cloneTime)) break;
			cloneTime = dateFns.subMinutes(cloneTime, this.props.interval);
		}

		if (dateFns.isAfter(this.state.startTime, cloneTime)) return false;
		
		apptBlock = this.state.appointmentBlocks[dateFns.format(cloneTime, date_format)];
		if (apptBlock && apptBlock[apptBlock.length-1] === dateFns.format(datetime, date_format)) return true;

		return false;
	}

	isAvailable(datetime){
		let now = new Date();
		if (datetime - now < 0) return false;
		if (dateFns.isPast(datetime)) return false;
		let endTime = this.state.endTime;
		endTime = dateFns.setDayOfYear(endTime, dateFns.getDayOfYear(datetime));
		if (dateFns.isEqual(datetime, endTime) || dateFns.isAfter(datetime, endTime)) return false;
		let date_index = dateFns.getDayOfYear(datetime);
		let appointments = this.state.appointments[date_index];
		
		if (!appointments) return true;

		for (let i = 0; i < appointments.length; ++i){
			let appt = appointments[i];
			let appt_end = dateFns.addMinutes(appt.datetime, appt.length);
			if (dateFns.isEqual(appt.datetime, datetime) || (dateFns.isAfter(datetime, appt.datetime) && dateFns.isBefore(datetime, appt_end)) ){
				return false;
			}
		}

		return true;
	}

	isBlockAvailable(datetime) {
		let length = this.props.serviceLength;
		while (length > 0) {
			if (!this.isAvailable(datetime)) return false;
			datetime = dateFns.addMinutes(datetime, this.props.interval);
			length -= this.props.interval;
		}
		return true;
	}

	mouseEnter = (datetime) => {
		this.updateMouseOver(datetime);
		this.updateMouseOverBlock(datetime);
	}
	mouseLeave = () => {
		this.clearMouseOver();
		this.clearMouseOverBlock();
	}

	updateMouseOver = (datetime) => {
		let date_format = "MM/DD/YYYY H:mm:ss";
		let mouseOver = null;
		if (this.isBlockAvailable(datetime)){
			mouseOver = dateFns.format(datetime, date_format);
		}
		this.setState({ mouseOver });
	}

	clearMouseOver = () => {
		this.setState({ mouseOver: null });
	}

	isMouseOver = (datetime) => {
		let date_format = "MM/DD/YYYY H:mm:ss";
		if (this.state.mouseOver === dateFns.format(datetime, date_format)) return true;
		return false;
	}

	updateMouseOverBlock = (datetime) => {
		let date_format = "MM/DD/YYYY H:mm:ss";
		let mouseOverBlock = new Set();
		if (this.isBlockAvailable(datetime)){
			let length = this.props.serviceLength;
			while (length > 0){
				mouseOverBlock.add(dateFns.format(datetime, date_format));
				datetime = dateFns.addMinutes(datetime, this.props.interval);
				length -= this.props.interval;				
			}
		}
		this.setState({ mouseOverBlock });
	}

	clearMouseOverBlock = () => {
		this.setState({ mouseOverBlock: new Set() });
	}

	isInMouseOverBlock = (datetime) => {
		let date_format = "MM/DD/YYYY H:mm:ss";
		if (this.state.mouseOverBlock.has(dateFns.format(datetime, date_format))) return true;
		return false;
	}

	setAppointment = () => {
		if (!this.isAvailable(new Date(this.state.mouseOver))){

		}
		else if (this.props.employee_view){

		}
		else {
			let dates = [];
			for (let datetime of this.state.mouseOverBlock) {
				dates.push(new Date(datetime));
			}
			if (dates.length === 0) return;
			// find earliest date
			let earliest = dates[0];
			dates.forEach(date => {
				if (dateFns.isBefore(date, earliest)) earliest = date;
			})
			this.props.setAppointment(earliest);
		}
	}

	renderHeader() {
		let date_format = "MMMM YYYY";

		return (
			<div className="header myrow noselect">
				<div className="mycol mycol-start">
					<div className="icon" onClick={this.props.movePrevWeek}>
						chevron_left
					</div>
				</div>
				<div className="mycol mycol-center">
					<span> {dateFns.format(this.props.currentMonth, date_format)} </span>
				</div>
				<div className="mycol mycol-end">
					<div className="icon" onClick={this.props.moveNextWeek}>
						chevron_right
					</div>
				</div>
			</div>
		)
	}

	renderDays() {
		const date_format = "ddd D";
		const days = [];

		let startDate = dateFns.startOfWeek(this.props.currentMonth);

		for (let i = 0; i < 7; ++i) {
			days.push(
				<div className="mycol mycol-center" key={i}>
					{dateFns.format(startDate, date_format)}
				</div>
			);
			startDate = dateFns.addDays(startDate, 1);
		}
		return <div className="days myrow noselect">{days}</div>
	}

	renderCells() {
		let day_columns = [];

		// Days of the week
		for (let day = 0; day < 7; ++day){
			let cells = [];

			let curTime = this.state.startTime;
			let endTime = this.state.endTime;
			curTime = dateFns.setDayOfYear(curTime, dateFns.getDayOfYear(dateFns.startOfWeek(this.props.currentMonth)));
			curTime = dateFns.setYear(curTime, dateFns.getYear(dateFns.startOfWeek(this.props.currentMonth)))
			endTime = dateFns.setDayOfYear(endTime, dateFns.getDayOfYear(dateFns.startOfWeek(this.props.currentMonth)));
			endTime = dateFns.setYear(endTime, dateFns.getYear(dateFns.startOfWeek(this.props.currentMonth)))
			curTime = dateFns.addDays(curTime, day);
			endTime = dateFns.addDays(endTime, day);

			if (curTime === null || endTime === null) return null;
			let key = 0;

			// Hours of the day (cells)
			while(dateFns.isAfter(endTime, curTime)){
				let slots = [];
				let slot_count = 60 / this.props.interval;
				
				// Slots of the hour (in ~15 minute intervals (this.props.interval minutes))
				for (let i = 0; i < slot_count; ++i){
					const cloneTime = curTime;
					const isAvailable = this.isAvailable(cloneTime);
					const isPast = this.isPast(cloneTime);
					let mouse_over = (isAvailable) ? this.isMouseOver(cloneTime) : null;
					let isFirstSlot = null;
					let isSecondSlot = null;
					let isLastSlot = null;
					if (!isAvailable && !isPast){
						isFirstSlot = this.isFirstSlotInAppointment(cloneTime);
						isSecondSlot = this.isSecondSlotInAppointment(cloneTime);
						isLastSlot = this.isLastSlotInAppointment(cloneTime);
					}
					//const isSecondSlot = this.isSecondSlotInAppointment(dateFns.parse(cloneTime));
					let appt = null;
					if (this.props.employee_view && !isPast && !isAvailable){
						appt = this.getAppointment(cloneTime);
					}

					// add text ?
					let text = null;
					if (day === 0 && i === 0) {
						text = <span className="mycol mycol-start time noselect">{dateFns.format(curTime, "h a")}</span>;
					}
					if (mouse_over && !this.isPast(cloneTime) && isAvailable) {
						text = <span className="mycol mycol-start time_over noselect">{dateFns.format(curTime, "h:mm a")}</span>;
					}
					if (this.props.employee_view && !isAvailable && !isPast && isSecondSlot) {
						// or appt.customer.firstname
						if (appt && appt.customer) text = <span className="mycol mycol-start name_over noselect"><span className="sm">for</span> {appt.customer.firstname}</span>;
					}
					if (this.props.employee_view && !isAvailable && !isPast && isFirstSlot) {
						// or appt.customer.firstname
						if (appt && appt.customer) text = <span className="mycol mycol-start name_over noselect">{appt.service.name}</span>;
					}

					// format styles
					let classes = "myrow slot ";
					if (this.props.interval === 5) classes += "slot-sm ";
					else classes += "slot-md ";
					if (i === slot_count - 1) classes += "border-bot ";
					else classes += "border-bot-light ";
					if (isPast) classes += "shaded ";
					else {
						if (!isAvailable) {
							if (this.props.employee_view) {
								classes += "is-appointment ";
								if (isFirstSlot) classes += "first-slot ";
								if (isLastSlot) classes += "last-slot ";
							}
							else {
								classes += "shaded ";
							}
						}
						else {
							classes += "available ";
						}
					}
					if (this.isInMouseOverBlock(cloneTime)) classes += "selectable ";

					// set click function
					let click = () => {
						if (!this.props.employee_view) {
							this.setAppointment();
						}
						else {
							if (!isAvailable && !isPast && this.props.showAppointment) {
								this.props.showAppointment(appt);
							}
						}
					};
					

					slots.push(
						<div 
							className={classes} 
							key={i}
							// eslint-disable-next-line
							onMouseEnter={() => { return this.mouseEnter(cloneTime)}}
							onMouseLeave={this.mouseLeave}
							onClick={click}
						>
							{text}
						</div>
					);

					curTime = dateFns.addMinutes(curTime, this.props.interval);
				}

				cells.push(
					<div className="cell" key={key}>
						{slots}
					</div>
				);
				key++;
			}


			day_columns.push(
				<div className="cells mycol" key={day}>
					{cells}
				</div>
			);

		}

		return <div className="myrow viewport">{day_columns}</div>;
	}

	render() {
		return (
			<div className="calendar">
				{this.renderHeader()}
				{this.renderDays()}
				{this.renderCells()}
			</div>
		)
	}
}

export default WeekView;