import { useState } from 'react';
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
		<form onSubmit={handleSubmit}>
			<label>
				Username:
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required minLength="5" placeholder="Username" />
			</label>
			<label>
				Password:
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="5" placeholder="Password" />
			</label>
			<label>
				Email:
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
			</label>
			<label>
				Birthday:
				<input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required placeholder="Birthday" />
			</label>
			<button type="submit">Submit</button>
		</form>
	);
};
