import { useState } from 'react';
export const LoginView = ({ onLoggedIn }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
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
				console.log('Login response: ', data);
				if (data.user) {
					localStorage.setItem('user', JSON.stringify(data.user));
					localStorage.setItem('token', data.token);
					onLoggedIn(data.user, data.token);
				} else {
					alert('No such user'); // This part might need adjusting based on how your API handles login failures
				}
			})
			.catch((e) => {
				console.log(e);
				alert('Something went wrong');
			});
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Username:
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
			</label>
			<label>
				Password:
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
			</label>
			<button type="submit">Submit</button>
		</form>
	);
};
