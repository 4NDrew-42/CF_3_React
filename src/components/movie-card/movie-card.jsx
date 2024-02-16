import React from 'react';
import PropTypes from 'prop-types';

export const MovieCard = ({ movie, onMovieClick }) => {
	return (
		<div
			onClick={() => {
				onMovieClick(movie);
			}}
		>
			{movie.Title}
		</div>
	);
};

MovieCard.propTypes = {
	movie: PropTypes.shape({
		Title: PropTypes.string.isRequired,
		ImageURL: PropTypes.string.isRequired,
		Director: PropTypes.string.isRequired,
	}).isRequired,
	onMovieClick: PropTypes.func.isRequired,
};

export default MovieCard;
