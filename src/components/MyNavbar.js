import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import auth from '../auth';

import UserModal from '../pages/modals/UserModal';

export class MyNavbar extends Component {
	constructor(props) {
		super(props);
		this.NavbarStyles = {
			backgroundColor: "#00000000",
			width: "100vw",
			paddingTop: "20px",
			paddingBottom: "20px",
			paddingLeft: "40px",
			paddingRight: "40px",
			fontSize: "16px",
			zIndex: "5"
		}
		if (this.props.color) {
			this.NavbarStyles.backgroundColor = this.props.color;
		}
		if (this.props.absolute) {
			this.NavbarStyles.position = "absolute";
			this.NavbarStyles.top = "0";
			this.NavbarStyles.left = "0";
		}
	}

	state = {
		display_user_modal: false,
	}

	show_user_modal = () => {
		this.setState({ display_user_modal: true });
	}
	hide_user_modal = () => {
		this.setState({ display_user_modal: false });
	}

	logout = async () => {
		await auth.logout();
	}

	render() {
		return (
			<Navbar variant="dark" style={this.NavbarStyles} >
				<Navbar.Brand style={NavbarBrandStyle} onClick={() => { this.props.history.push('/') }}>Giggz</Navbar.Brand>
				<Nav className="ml-auto">

					<Nav.Item hidden={!auth.isAuthenticated()} onClick={this.show_user_modal}>
						<Nav.Link style={UsernameStyles}>
							<i className="fa fa-lg fa-user-circle-o" style={UserIconStyles}></i> &nbsp;
							{auth.getCachedUser().firstname} {auth.getCachedUser().lastname}
						</Nav.Link>
					</Nav.Item>

					<Nav.Link style={NavbarLinkStyle} hidden={!auth.isAuthenticated()} onClick={this.logout}>Logout </Nav.Link>
				</Nav>
				<UserModal hidden={!auth.isAuthenticated()} show={this.state.display_user_modal} onHide={this.hide_user_modal} ></UserModal>
			</Navbar>
		)
	}
}

const nav_text_color = "#f8f8ff";

const NavbarBrandStyle = {
	color: nav_text_color,
	fontSize: "22px",
	cursor: "pointer"
}

const NavbarLinkStyle = {
	color: nav_text_color,
}

const UsernameStyles = {
	paddingRight: "20px",
	color: nav_text_color,
	fontWeight: "bold"
}

const UserIconStyles = {
	fontSize: "25px"
}

export default MyNavbar;