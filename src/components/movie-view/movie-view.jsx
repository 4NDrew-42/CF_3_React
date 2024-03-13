import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './movie-view.scss';

export const MovieView = ({ movies, user, onFavoriteToggle }) => {
	const { movieId } = useParams();
	const movie = movies.find((m) => m._id === movieId);
	const navigate = useNavigate();

	// Determine if the movie is a favorite
	const isFavorite = user?.favoriteMovies.includes(movie._id);

	const handleFavoriteClick = () => {
		onFavoriteToggle(movie._id, isFavorite);
	};

	if (!movie) return null;

	return (
		<div className="movie-view-container movie-view-text">
			<div className="movie-view">
				<div className="movie-view-left">
					<img src={movie.ImageURL} alt={movie.Title} className="movie-view-image" />
				</div>
				<div className="movie-view-right">
					<h2>{movie.Title}</h2>
					<p>
						<strong>Director:</strong> {movie.Director}
					</p>
					<p>
						<strong>Description:</strong> {movie.Description}
					</p>
				</div>
				<div className="movie-view-actions d-flex justify-content-between align-items-center">
					<Button className="favorite-button me-auto" variant={isFavorite ? 'danger' : 'primary'} onClick={handleFavoriteClick}>
						{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
					</Button>
					<Link to="/movies" className="back-button btn btn-custom">
						Back
					</Link>
				</div>
			</div>
		</div>
	);
};
