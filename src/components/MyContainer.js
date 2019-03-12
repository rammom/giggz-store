import React from 'react';
import { Container } from 'react-bootstrap';

function MyContainer({style, ...props}) {
	return (
		<Container style={{...ContainerStyles, ...style}}>
			{props.children}
		</Container>
	)
}

const ContainerStyles = {
	marginTop: "30px",
}

export default MyContainer;
