import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import './main-view.scss';
export const MainView = () => {
	const storedUser = JSON.parse(localStorage.getItem('user'));
	const storedToken = localStorage.getItem('token');
	const [movies, setMovies] = useState([]);
	const [selectedMovie, setSelectedMovie] = useState(null);
	const [user, setUser] = useState(storedUser ? storedUser : null);
	const [token, setToken] = useState(storedToken ? storedToken : null);
	const [showLogin, setShowLogin] = useState(true); // true shows login, false shows signup

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
		<Container className="d-flex justify-content-center align-items-center vh-80" style={{ minHeight: '100vh' }}>
			<Card className="auth-card">
				<Card.Body>
					{!user ? (
						<>
							{showLogin ? (
								<LoginView
									onLoggedIn={(user, token) => {
										setUser(user);
										setToken(token);
									}}
								/>
							) : (
								<SignupView />
							)}
							<Row className="mt-3">
								<Col>
									{showLogin ? (
										<Button variant="dark" onClick={() => setShowLogin(false)}>
											Sign Up
										</Button>
									) : (
										<Button variant="dark" onClick={() => setShowLogin(true)}>
											Login
										</Button>
									)}
								</Col>
								<Col>
									<Button variant="dark" onClick={handleLogout} style={{ visibility: user ? 'visible' : 'hidden' }}>
										Log Out
									</Button>
								</Col>
							</Row>
						</>
					) : (
						<Row>
							{selectedMovie ? (
								<MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
							) : movies.length === 0 && user ? ( // Check if the user is logged in and movies list is empty
								<Col>The list is empty!</Col>
							) : (
								movies.map((movie) => (
									<Col md={4} key={movie._id}>
										<MovieCard
											movie={movie}
											onMovieClick={(newSelectedMovie) => {
												setSelectedMovie(newSelectedMovie);
											}}
										/>
									</Col>
								))
							)}
						</Row>
					)}
					{user && (
						<Row className="justify-content-md-center text-center mt-3">
							<Col>
								<Button variant="dark" onClick={handleLogout}>
									Log Out
								</Button>
							</Col>
						</Row>
					)}
				</Card.Body>
			</Card>
		</Container>
	);
};
