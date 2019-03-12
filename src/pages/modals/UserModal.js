import React from 'react'
import Modal from 'react-bootstrap/Modal'
import auth from '../../auth';

function UserModal(props) {
	let user = auth.getCachedUser();
	return (
		<Modal size="lg" show={props.show} onHide={props.onHide} centered>
			<Modal.Body style={BodyStyles}>
				<img
					style={ProfileImageStyle}
					src={user.image}
					alt="profile"
				/>
				<h1>{user.firstname} {user.lastname}</h1>
				<b>Email: </b><span>{user.email}</span><br />
				<b>Phone: </b><span>{user.phone}</span>
			</Modal.Body>
		</Modal>
	)
}

const BodyStyles = {
	textAlign: "center"
}

const ProfileImageStyle = {
	borderRadius: "50%",
	border: "3px solid black",
	width: "25%",
	margin: "auto",
	marginBottom: "10px"
}

export default UserModal
