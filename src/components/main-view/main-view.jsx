import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import silenceImg from '../../img/silence.png';
import akiraImg from '../../img/akira.png';
import fountainImg from '../../img/fountain.png';

export const MainView = () => {
	const [movie, setMovie] = useState([]);
	const [selectedMovie, setSelectedMovie] = useState(null);

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

	if (movie.length === 0) return <div className="main-view">The list is empty!</div>;

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
};
