import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'react-bootstrap-icons';
import { HeartFill } from 'react-bootstrap-icons';
import './movie-card.scss';
import '../../index.scss';

export const MovieCard = ({ movie, user, token, onFavoriteToggle }) => {
	const navigate = useNavigate();

	const handleCardClick = () => {
		navigate(`/movies/${movie._id}`);
	};

	const handleFavoriteClick = (event) => {
		event.stopPropagation(); // Prevent the card click event from triggering
		onFavoriteToggle(movie._id);
	};

	const isFavorite = user && user.favorites && user.favorites.includes(movie._id);

	return (
		<Card className="movie-card transparent-blur-overlay" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
			<div className="image-container">
				<Card.Img variant="" src={movie.ImageURL} alt={`The cover of ${movie.Title}`} className="movie-card-img" />
			</div>
			<Card.Body className="movie-card-body">
				<Card.Title className="movie-card-title">{movie.Title}</Card.Title>
				<Card.Text className="movie-card-text">{movie.Director}</Card.Text>
				{user && (
					<Button variant={isFavorite ? 'danger' : 'primary'} onClick={handleFavoriteClick}>
						{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
					</Button>
				)}
			</Card.Body>
		</Card>
	);
};

MovieCard.propTypes = {
	movie: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		Title: PropTypes.string.isRequired,
		Director: PropTypes.string.isRequired,
		Description: PropTypes.string.isRequired,
		ImageURL: PropTypes.string.isRequired,
	}).isRequired,
	user: PropTypes.object,
	token: PropTypes.string,
	onFavoriteToggle: PropTypes.func.isRequired,
};
