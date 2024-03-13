import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from '../movie-card/movie-card';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import './profile-view.scss';

export const ProfileView = ({ user, movies, token, onFavoriteToggle }) => {
	const [userData, setUserData] = useState(null);
	const [favoriteMovies, setFavoriteMovies] = useState([]);
	const [updatedUsername, setUpdatedUsername] = useState('');
	const [updatedPassword, setUpdatedPassword] = useState('');
	const [updatedEmail, setUpdatedEmail] = useState('');
	const [updatedBirthday, setUpdatedBirthday] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user || !token) return;
		const fetchUserData = async () => {
			try {
				const res = await fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user.username}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error('Failed to fetch user data');
				const data = await res.json();
				setUserData(data);
			} catch (err) {
				console.error(err);
				setError('Failed to fetch user data');
			}
		};

		fetchUserData();
	}, [user, token]);

	useEffect(() => {
		if (movies && user && user.favoriteMovies) {
			setFavoriteMovies(movies.filter((movie) => user.favoriteMovies.includes(movie._id)));
		}
	}, [movies, user]);

	const handleUpdate = async (event) => {
		event.preventDefault();

		const data = {
			username: updatedUsername,
			password: updatedPassword,
			email: updatedEmail,
			birthday: updatedBirthday,
		};

		try {
			const response = await fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user.username}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				const updatedData = await response.json();
				setUserData(updatedData);
				setIsEditing(false);
			} else {
				setError('Failed to update user data');
			}
		} catch (error) {
			console.error('Error updating user data:', error);
			setError('Failed to update user data');
		}
	};

	const handleDelete = async () => {
		try {
			const response = await fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user.username}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				localStorage.clear();
				// Redirect to login page or update app state
			} else {
				setError('Failed to delete account');
			}
		} catch (error) {
			console.error('Error deleting account:', error);
			setError('Failed to delete account');
		}
	};

	const handleFavoriteToggle = async (movieID) => {
		try {
			const isFavorite = userData.favoriteMovies.includes(movieID);
			const method = isFavorite ? 'DELETE' : 'POST';
			const response = await fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user.username}/movies/${movieID}`, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const updatedFavoriteMovies = isFavorite ? userData.favoriteMovies.filter((id) => id !== movieID) : [...userData.favoriteMovies, movieID];
				setUserData({ ...userData, favoriteMovies: updatedFavoriteMovies });

				if (isFavorite) {
					setFavoriteMovies(favoriteMovies.filter((movie) => movie._id !== movieID));
				}
			} else {
				setError('Failed to update favorite movies');
			}
		} catch (error) {
			console.error('Error updating favorite movies:', error);
			setError('Failed to update favorite movies');
		}
	};

	return (
		<div className="profile-view">
			<Card className="profile-info">
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

			{favoriteMovies.length > 0 ? (
				<div>
					<h4 className="profile-view">Favorite Movies</h4>
					<Row>
						{favoriteMovies.map((movie) => (
							<Col key={movie._id} xs={12} sm={6} md={4} lg={3}>
								<Card className="movie-card transparent-blur-overlay" style={{ cursor: 'pointer' }} onClick={() => navigate(`/movies/${movie._id}`)}>
									<div className="image-container">
										<Card.Img variant="" src={movie.ImageURL} alt={`The cover of ${movie.Title}`} className="movie-card-img" />
									</div>
									<Card.Body className="movie-card-body">
										<Card.Title className="movie-card-title">{movie.Title}</Card.Title>
										<Card.Text className="movie-card-text">{movie.Director}</Card.Text>
										{userData && (
											<Button
												variant={userData.favoriteMovies.includes(movie._id) ? 'danger' : 'primary'}
												onClick={(event) => {
													event.stopPropagation();
													handleFavoriteToggle(movie._id, userData.favoriteMovies.includes(movie._id));
												}}
											>
												{userData.favoriteMovies.includes(movie._id) ? 'Remove' : 'Add to Favorites'}
											</Button>
										)}
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			) : (
				<p>No favorite movies yet.</p>
			)}

			{error && <p className="text-danger">{error}</p>}
		</div>
	);
};

export default ProfileView;
