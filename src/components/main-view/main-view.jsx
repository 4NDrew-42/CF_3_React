import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ProfileView } from '../profile-view/profile-view';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import './main-view.scss';

export const MainView = () => {
	const storedUser = JSON.parse(localStorage.getItem('user'));
	const storedToken = localStorage.getItem('token');
	const [movies, setMovies] = useState([]);
	const [user, setUser] = useState(storedUser ? storedUser : null);
	const [token, setToken] = useState(storedToken ? storedToken : null);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!token) {
			return;
		}

		fetch('https://art-cine-be3340ead7b8.herokuapp.com/movies', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				const moviesFromApi = data.map((doc) => ({
					_id: doc._id,
					Title: doc.title,
					Director: doc.director.name,
					Description: doc.description,
					ImageURL: doc.imageurl,
				}));
				setMovies(moviesFromApi);
			})
			.catch((error) => {
				console.error('Error fetching movies:', error);
				setError('Unable to fetch movies. Please try again later.');
			});
	}, [token]);

	useEffect(() => {
		if (!token || !user || !user.Username) {
			return;
		}

		fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user.Username}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Unable to fetch user data');
				}
			})
			.then((data) => {
				setUser(data);
				localStorage.setItem('user', JSON.stringify(data));
			})
			.catch((error) => {
				console.error('Error fetching user data:', error);
				setError('Unable to fetch user data. Please try again later.');
			});
	}, [token, user]);

	const handleLogout = () => {
		setUser(null);
		setToken(null);
		localStorage.clear();
	};

	const handleFavoriteToggle = async (movieId) => {
		if (!user || !token) {
			return;
		}

		try {
			const method = user.FavoriteMovies.includes(movieId) ? 'DELETE' : 'POST';
			const response = await fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user.Username}/favoriteMovies/${movieID}`, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const updatedUser = { ...user };
				if (method === 'POST') {
					updatedUser.FavoriteMovies = [...user.FavoriteMovies, movieId];
				} else {
					updatedUser.FavoriteMovies = user.FavoriteMovies.filter((id) => id !== movieId);
				}
				setUser(updatedUser);
				localStorage.setItem('user', JSON.stringify(updatedUser));
			} else {
				throw new Error('Failed to update favorite movies');
			}
		} catch (error) {
			console.error('Error updating favorite movies:', error);
			setError('Unable to update favorite movies. Please try again later.');
		}
	};

	return (
		<BrowserRouter className="container-fluid">
			<NavigationBar className="navbar" user={user} onLoggedOut={handleLogout} />
			<Container fluid>
				<Row className="main-view justify-content-md-center">
					{error && (
						<Col md={12}>
							<Alert variant="danger">{error}</Alert>
						</Col>
					)}
					<Routes>
						<Route
							path="/signup"
							element={
								<Col md={5}>
									<SignupView />
								</Col>
							}
						/>
						<Route
							path="/login"
							element={
								<Col md={5}>
									<LoginView
										onLoggedIn={(user, token) => {
											setUser(user);
											setToken(token);
											localStorage.setItem('user', JSON.stringify(user));
											localStorage.setItem('token', token);
										}}
									/>
								</Col>
							}
						/>
						<Route
							path="/movies/:movieId"
							element={
								!user ? (
									<Navigate to="/login" replace />
								) : (
									<Col md={8}>
										<MovieView movies={movies} />
									</Col>
								)
							}
						/>
						<Route
							path="/movies"
							element={
								!user ? (
									<Navigate to="/login" replace />
								) : movies.length === 0 ? (
									<Col>The list is empty!</Col>
								) : (
									<Row>
										{movies.map((movie) => (
											<Col md={4} key={movie._id}>
												<MovieCard movie={movie} user={user} token={token} onFavoriteToggle={handleFavoriteToggle} />
											</Col>
										))}
									</Row>
								)
							}
						/>
						<Route path="/users/:username" element={user ? <ProfileView user={user} token={token} /> : <Navigate to="/login" replace />} />
						<Route path="/" element={<Navigate replace to="/movies" />} />
					</Routes>
				</Row>
			</Container>
		</BrowserRouter>
	);
};
