import './movie-view.scss';
export const MovieView = ({ movie, onBackClick }) => {
	return (
		<div>
			<div>
				<img src={movie.ImageURL} alt={movie.Title} style={{ width: '50%', height: 'auto' }} />
			</div>
			<div>
				<span>Title: </span>
				<span>{movie.Title}</span>
			</div>
			<div>
				<span>Director: </span>
				<span>{movie.Director}</span>
			</div>
			<div>
				<span>Description: </span>
				<span>{movie.Description} </span>
			</div>
			<button onClick={onBackClick} className="btn-custom" style={{ cursor: 'pointer' }}>
				Back
			</button>
		</div>
	);
};
