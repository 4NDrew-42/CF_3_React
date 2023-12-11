export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div>
            <div>
                <img src={movie.image} alt="Book cover" style={{width: '50%', height: 'auto'}}/>
            </div>
            <div>
                <span>Title:</span>
                <span>{movie.title}</span>
            </div>
            <div>
                <span>Director:</span>
                <span>{movie.director}</span>
            </div>
            <div style={{width: '50%'}}>
                <span>Description:</span>
                <span>{movie.description} </span>
            </div>
            <button onClick={onBackClick}>Back</button>
        </div>
    );
};