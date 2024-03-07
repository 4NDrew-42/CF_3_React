import React from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import './movie-view.scss';

export const MovieView = ({ movies }) => {
	let { movieId } = useParams(); // Extract movieId from URL
	const movie = movies.find((m) => m._id === movieId); // Find the movie by ID

	if (!movie) return null; // or some loading/error handling

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
				<Link to="/movies" className="back-button btn btn-custom">
					Back
				</Link>
			</div>
		</div>
	);
};
