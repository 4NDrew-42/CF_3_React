import React, { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import './profile-view.scss';

export const ProfileView = ({ user, token }) => {
	const [userData, setUserData] = useState(null);
	const [movies, setMovies] = useState([]);
	const [favoriteMovies, setFavoriteMovies] = useState([]);
	const [updatedUsername, setUpdatedUsername] = useState('');
	const [updatedPassword, setUpdatedPassword] = useState('');
	const [updatedEmail, setUpdatedEmail] = useState('');
	const [updatedBirthday, setUpdatedBirthday] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (!user || !token) return;

		fetch('https://art-cine-be3340ead7b8.herokuapp.com/users', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				const loggedInUser = data.find((u) => u.username === user.username);
				setUserData(loggedInUser);
				fetchFavoriteMovies(loggedInUser.favoriteMovieIds);
				setUpdatedUsername(loggedInUser.username);
				setUpdatedEmail(loggedInUser.email);
				setUpdatedBirthday(loggedInUser.birthday);
			})
			.catch((err) => console.error(err));
	}, [user, token]);

	const fetchFavoriteMovies = (favoriteMovieIds) => {
		fetch('https://art-cine-be3340ead7b8.herokuapp.com/movies', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				const moviesFromApi = data.map((doc) => ({
					_id: doc._id,
					Title: doc.title,
					Director: doc.director.name,
					Description: doc.description,
					ImageURL: doc.imageurl,
				}));
				const favoritedMovies = moviesFromApi.filter((movie) => favoriteMovieIds.includes(movie._id));
				setMovies(moviesFromApi);
				setFavoriteMovies(favoritedMovies);
			})
			.catch((err) => console.error(err));
	};

	const updateUserData = (updatedData) => {
		fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user._id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedData),
		})
			.then((res) => res.json())
			.then((data) => setUserData(data))
			.catch((err) => console.error(err));
	};

	const deregisterUser = () => {
		fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user._id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(() => {
				localStorage.clear();
				// Redirect to login page
			})
			.catch((err) => console.error(err));
	};

	const handleFavoriteMovie = (movieId, isFavorite) => {
		const updatedFavoriteMovieIds = isFavorite ? userData.favoriteMovieIds.filter((id) => id !== movieId) : [...userData.favoriteMovieIds, movieId];

		fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user._id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ favoriteMovieIds: updatedFavoriteMovieIds }),
		})
			.then((res) => res.json())
			.then((data) => {
				setUserData(data);
				fetchFavoriteMovies(data.favoriteMovieIds);
			})
			.catch((err) => console.error(err));
	};
	const handleUpdate = (event) => {
		event.preventDefault();

		const data = {
			username: updatedUsername,
			password: updatedPassword,
			email: updatedEmail,
			birthday: updatedBirthday,
		};

		fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${userData._id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((data) => setUserData(data))
			.catch((err) => console.error(err));

		setIsEditing(false);
	};

	const handleDelete = () => {
		fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${userData._id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(() => {
				localStorage.clear();
				// Redirect to login page
			})
			.catch((err) => console.error(err));
	};

	return (
		<div className="profile-view">
			<Card className="profile-card">
				<Card.Body>
					<Row>
						<Col>
							<div className="welcome">
								<div>{userData?.username}</div>
							</div>
						</Col>
						<Col className="d-flex justify-content-end">
							<Button variant="link" onClick={() => setIsEditing(!isEditing)} className="edit-button">
								{isEditing ? 'Cancel' : 'Edit Profile'}
							</Button>
							<Button variant="danger" onClick={handleDelete} className="delete-button">
								Delete Account
							</Button>
						</Col>
					</Row>

					{isEditing && userData && (
						<Form onSubmit={handleUpdate}>
							<Form.Group controlId="profileUsername" className="mb-3">
								<Form.Label>Username</Form.Label>
								<Form.Control type="text" placeholder="Username" value={updatedUsername} onChange={(e) => setUpdatedUsername(e.target.value)} required minLength="5" />
							</Form.Group>

							<Form.Group controlId="profilePassword" className="mb-3">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" placeholder="Password" value={updatedPassword} onChange={(e) => setUpdatedPassword(e.target.value)} required minLength="5" />
							</Form.Group>

							<Form.Group controlId="profileEmail" className="mb-3">
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" placeholder="Email" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} required />
							</Form.Group>

							<Form.Group controlId="profileBirthday" className="mb-3">
								<Form.Label>Birthday</Form.Label>
								<Form.Control type="date" value={updatedBirthday} onChange={(e) => setUpdatedBirthday(e.target.value)} required />
							</Form.Group>

							<Button variant="dark" type="submit" className="mt-3">
								Update Profile
							</Button>
						</Form>
					)}
				</Card.Body>
			</Card>

			{favoriteMovies.length > 0 && (
				<div>
					<h2 className="favorite-movies-title">Favorite Movies</h2>
					<Row>
						{favoriteMovies.map((movie) => (
							<Col md={4} key={movie._id}>
								<MovieCard movie={movie} isFavorite={true} />
							</Col>
						))}
					</Row>
				</div>
			)}
		</div>
	);
};

export default ProfileView;
