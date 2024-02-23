import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import './signup-view.scss'; // Ensure this file exists and imports any necessary styles

export const SignupView = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [birthday, setBirthday] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();

		const data = {
			username,
			password,
			email,
			birthday,
		};

		fetch('https://art-cine-be3340ead7b8.herokuapp.com/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}).then((response) => {
			if (response.ok) {
				alert('You have successfully signed up! Please log in.');
				window.location.reload();
			} else {
				alert('Error! Please try again.');
			}
		});
	};

	return (
		<Form onSubmit={handleSubmit} className="auth-form">
			<Form.Group controlId="signupUsername" className="mb-3">
				<Form.Label>Username</Form.Label>
				<Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength="5" />
			</Form.Group>

			<Form.Group controlId="signupPassword" className="mb-3">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="5" />
			</Form.Group>

			<Form.Group controlId="signupEmail" className="mb-3">
				<Form.Label>Email</Form.Label>
				<Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
			</Form.Group>

			<Form.Group controlId="signupBirthday" className="mb-3">
				<Form.Label>Birthday</Form.Label>
				<Form.Control type="date" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
			</Form.Group>

			<div className="d-flex justify-content-between">
				<Button variant="dark" type="submit">
					Sign Up
				</Button>
			</div>
		</Form>
	);
};
