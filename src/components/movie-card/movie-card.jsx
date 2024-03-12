import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart } from 'react-bootstrap-icons';
import { HeartFill } from 'react-bootstrap-icons';
import './movie-card.scss';
import '../../index.scss';

export const MovieCard = ({ movie, user, token, onFavoriteToggle }) => {
	const navigate = useNavigate();
	const [isFavorite, setIsFavorite] = useState(user?.favoriteMovies.includes(movie._id));

	const handleCardClick = () => {
		navigate(`/movies/${movie._id}`);
	};

	useEffect(() => {
		setIsFavorite(user?.favoriteMovies.includes(movie._id));
	}, [user, movie._id]);

	const handleFavoriteClick = async (event) => {
		event.stopPropagation(); // Prevent the card click event from triggering

		console.log('User:', user);
		console.log('Movie ID:', movie._id);

		if (!user || !token) {
			console.error('User or token not available');
			return;
		}

		try {
			const movieId = movie._id; // Use the _id directly as a string

			const response = await fetch(`https://art-cine-be3340ead7b8.herokuapp.com/users/${user.username}/movies/${movieId}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				setIsFavorite(true); // Optimistically update the local state
				onFavoriteToggle(movieId); // Notify the MainView to update the server state
			} else {
				console.error('Failed to add movie to favorites');
			}
		} catch (error) {
			console.error('Error adding movie to favorites:', error);
		}
	};

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

// ... (PropTypes remain the same)

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
