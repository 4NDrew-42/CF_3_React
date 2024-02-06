import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';

export const MainView = () => {
	const [movie, setMovie] = useState([]);
	const [selectedMovie, setSelectedMovie] = useState(null);
	const [user, setUser] = useState(null);

	/*if (!user) {
		return <LoginView />;
	}
*/
	useEffect(() => {
		fetch('https://art-cine-be3340ead7b8.herokuapp.com/movies')
			.then((res) => res.json())
			.then((data) => {
				setMovie(data);
			});
	}, []);

	if (selectedMovie) {
		return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />;
	}

	if (movie.length === 0) {
		return <div className="main-view">The list is empty!</div>;
	} else {
		return (
			<div>
				{movie.map((movie) => (
					<MovieCard
						key={movie._id}
						movie={movie}
						movieId={movie.movieId}
						onMovieClick={(newSelectedMovie) => {
							console.log('Selected Movie: ', newSelectedMovie);
							setSelectedMovie(newSelectedMovie);
						}}
					/>
				))}
			</div>
		);
	}
};
