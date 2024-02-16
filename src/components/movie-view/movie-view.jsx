export const MovieView = ({ movie, onBackClick }) => {
	return (
		<div>
			<div>
				{/* Update the image source to use movie.imageurl */}
				<img src={movie.ImageURL} alt={movie.Title} style={{ width: '50%', height: 'auto' }} />
			</div>
			<div>
				<span>Title: </span>
				<span>{movie.Title}</span>
			</div>
			<div>
				{/* Display director's name */}
				<span>Director: </span>
				<span>{movie.Director}</span>
			</div>
			<div style={{ width: '50%' }}>
				<span>Description: </span>
				<span>{movie.Description} </span>
			</div>
			<button onClick={onBackClick}>Back</button>
		</div>
	);
};
