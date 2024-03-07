import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './signup-view.scss';

export const SignupView = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [birthday, setBirthday] = useState('');
	const navigate = useNavigate();

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
				navigate('/login');
			} else {
				alert('Error! Please try again.');
			}
		});
	};

	return (
		<div className="signup-view">
			<Card className="signup-card">
				<div className="welcome">
					<div>Welcome to ArtCine!</div>
					<div className="welcome1">Sign up to create an account.</div>
				</div>
				<Card.Body>
					<Form onSubmit={handleSubmit}>
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
							<Form.Control type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
						</Form.Group>

						<Button variant="dark" type="submit" className="mt-3">
							Sign Up
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</div>
	);
};
