import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './movie-card.scss';
import '../../index.scss';

export const MovieCard = ({ movie }) => {
	const navigate = useNavigate(); // Initialize useNavigate hook

	// Function to handle click event
	const handleCardClick = () => {
		navigate(`/movies/${movie._id}`); // Navigate to the movie detail view
	};

	return (
		<Card className="movie-card transparent-blur-overlay" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
			<div className="image-container">
				{' '}
				<Card.Img variant="" src={movie.ImageURL} alt={`The cover of ${movie.Title}`} className="movie-card-img" />
			</div>
			<Card.Body className="movie-card-body">
				<Card.Title className="movie-card-title">{movie.Title}</Card.Title>
				<Card.Text className="movie-card-text">{movie.Director}</Card.Text>
			</Card.Body>
		</Card>
	);
};

MovieCard.propTypes = {
	movie: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		Title: PropTypes.string.isRequired,
		ImageURL: PropTypes.string.isRequired,
		Director: PropTypes.string.isRequired,
	}).isRequired,
};
