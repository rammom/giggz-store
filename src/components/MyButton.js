import React from 'react';
import { Button } from 'react-bootstrap';

function MyButton({text, style, ...props}) {
	return (
		<Button {...props} variant="dark" style={{...ButtonStyles, ...style}}>
			{text}
		</Button>
	)
}

const ButtonStyles = {
	backgroundColor: "#dd0000",
	borderColor: "#dd0000",
}

export default MyButton;