import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import './movie-card.scss'; // Adjust the path as necessary

export const MovieCard = ({ movie, onMovieClick }) => {
	return (
		<Card className="movie-card" onClick={() => onMovieClick(movie)} style={{ cursor: 'pointer' }}>
			<Card.Img variant="top" src={movie.ImageURL} alt={`The cover of ${movie.Title}`} className="movie-card-img" />
			<Card.Body className="movie-card-body">
				<Card.Title className="movie-card-title">{movie.Title}</Card.Title>
				<Card.Text className="movie-card-text"> {movie.Director}</Card.Text>
			</Card.Body>
		</Card>
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
