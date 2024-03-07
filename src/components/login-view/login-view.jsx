import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './login-view.scss';

export const LoginView = ({ onLoggedIn }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		// Log for debugging; remove or replace with a more secure logging method in production.
		console.log(username);

		const data = {
			username,
			password,
		};

		fetch('https://art-cine-be3340ead7b8.herokuapp.com/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				console.log('Login response: ', data); // Log for debugging purposes
				if (data.user) {
					localStorage.setItem('user', JSON.stringify(data.user));
					localStorage.setItem('token', data.token);
					onLoggedIn(data.user, data.token);
					navigate('/movies');
				} else {
					alert('No such user');
				}
			})
			.catch((error) => {
				console.error('Error during login: ', error);
				alert('Something went wrong');
			});
	};

	return (
		<div className="d-flex justify-content-center align-items-center login-view-container" style={{ height: '100vh' }}>
			{' '}
			{/* Ensures full viewport height and centers the card */}
			<Card className="auth-card">
				<Card.Body>
					<h3 className="text-center bold">ArtCine Login</h3> {/* Updated for text-center and bold class */}
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="formUsername" className="mb-3">
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength="3" />
						</Form.Group>
						<Form.Group controlId="formPassword" className="mb-3">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</Form.Group>
						<Button variant="dark" type="submit" className="w-100 mt-3">
							Submit
						</Button>{' '}
						{/* w-100 for full width */}
					</Form>
				</Card.Body>
			</Card>
		</div>
	);
};
