export const MovieView = ({ movie, onBackClick }) => {
	console.log('MovieView rendering with movie:', movie);

	if (!movie) {
		return <div>Movie data not available</div>;
	}

	return (
		<div>
			<div>
				{/* Update the image source to use movie.imageurl */}
				<img src={movie.imageurl} alt={movie.title} style={{ width: '50%', height: 'auto' }} />
			</div>
			<div>
				<span>Title:</span>
				<span>{movie.title}</span>
			</div>
			<div>
				{/* Display director's name */}
				<span>Director:</span>
				<span>{movie.director.name}</span>
			</div>
			<div style={{ width: '50%' }}>
				<span>Description:</span>
				<span>{movie.description} </span>
			</div>
			<button onClick={onBackClick}>Back</button>
		</div>
	);
};
