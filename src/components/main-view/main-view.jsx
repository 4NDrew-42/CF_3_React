import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
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

	useEffect(() => {
		if (!token) {
			return;
		}

		fetch('https://art-cine-be3340ead7b8.herokuapp.com/movies', {
			headers: { Authorization: `Bearer ${token}` },
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
				setMovies(moviesFromApi);
			});
	}, [token]);

	const handleLogout = () => {
		setUser(null);
		setToken(null);
		localStorage.clear();
	};

	return (
		<BrowserRouter className="container-fluid">
			<NavigationBar
				className="navbar"
				user={user}
				onLoggedOut={() => {
					setUser(null);
					setToken(null);
					localStorage.clear();
				}}
			/>
			<Container fluid>
				<Row className="main-view justify-content-md-center">
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
												<MovieCard movie={movie} />
											</Col>
										))}
									</Row>
								)
							}
						/>
						<Route path="/" element={<Navigate replace to="/movies" />} />
					</Routes>
				</Row>
			</Container>
		</BrowserRouter>
	);
};
