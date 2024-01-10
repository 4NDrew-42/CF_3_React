import { useState } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import silenceImg from '../../img/silence.png';
import akiraImg from '../../img/akira.png';
import fountainImg from '../../img/fountain.png';

export const MainView = () => {
	const [movie, setMovie] = useState([
		{
			id: 1,
			title: 'Silence of the Lambs',
			image: silenceImg,
			description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
			director: 'Jonathan Demme',
		},
		{
			id: 2,
			title: 'Akira',
			image: akiraImg,
			description:
				'A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by two teenagers and a group of psychics.',
			director: 'Katsuhiro Otomo',
		},
		{
			id: 3,
			title: 'The Fountain',
			image: fountainImg,
			description: 'As a modern-day scientist, Tommy is struggling with mortality, desperately searching for the medical breakthrough that will save the life of his cancer-stricken wife, Izzi.',
			director: 'Darren Aronofsky',
		},
	]);

	const [selectedMovie, setSelectedMovie] = useState(null);

	if (selectedMovie) {
		return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />;
	}

	if (movie.length === 0) return <div className="main-view">The list is empty!</div>;

	return (
		<div>
			{movie.map((movie) => (
				<MovieCard
					key={movie.id}
					movie={movie}
					onMovieClick={(newSelectedMovie) => {
						setSelectedMovie(newSelectedMovie);
					}}
				/>
			))}
		</div>
	);
};
