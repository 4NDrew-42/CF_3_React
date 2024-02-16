import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';

export const MainView = () => {
	const storedUser = JSON.parse(localStorage.getItem('user'));
	const storedToken = localStorage.getItem('token');
	const [movies, setMovies] = useState([]);
	const [selectedMovie, setSelectedMovie] = useState(null);
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
				console.log(data);

				const moviesFromApi = data.map((doc) => {
					return {
						_id: doc._id,
						Title: doc.title,
						Director: doc.director.name,
						Description: doc.description,
						ImageURL: doc.imageurl,
					};
				});

				setMovies(moviesFromApi);
			});
	}, [token]);

	if (!user) {
		return (
			<>
				<LoginView
					onLoggedIn={(user, token) => {
						setUser(user);
						setToken(token);
					}}
				/>
				or
				<SignupView />
			</>
		);
	}

	if (selectedMovie) {
		return (
			<>
				<button
					onClick={() => {
						setUser(null);
						setToken(null);
						localStorage.clear();
					}}
				>
					Log Out
				</button>

				<MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
			</>
		);
	}

	if (movies.length === 0) {
		return (
			<>
				<button
					onClick={() => {
						setUser(null);
						setToken(null);
						localStorage.clear();
					}}
				>
					Log Out
				</button>
				<div>The list is empty!</div>
			</>
		);
	}

	return (
		<div>
			<button
				onClick={() => {
					setUser(null);
					setToken(null);
					localStorage.clear();
				}}
			>
				Log Out
			</button>

			{movies.map((movie) => (
				<MovieCard
					key={movie._id}
					movie={movie}
					movieId={movie.movieId}
					onMovieClick={(newSelectedMovie) => {
						setSelectedMovie(newSelectedMovie);
					}}
				/>
			))}
		</div>
	);
};
