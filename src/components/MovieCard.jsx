function MovieCard({ movie, cast = [], variant='alternative'}){
  const className = variant === 'main' ? 'mainMovieCard' : 'alternativeMovieCard';

  return (
    <div className={className}>
      {movie.poster_path ? (
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` } alt={movie.title}></img>
      ) : (
        <div className="noPoster">No poster</div>
      )}
      <div className={variant === 'main' ? 'mainMovieInfo' : ''}>
        <p className="title">{movie.title}</p>
        <p className="meta">Release Date: {movie.release_date}</p>
        <p className="meta">Score: {movie.vote_average}</p>
        {variant === 'main' && <p className="meta">Description: {movie.overview}</p>}
        {variant === 'main' && cast.length > 0 && (<p className="meta">Actors: {cast.join(', ')} </p>)}
      </div>
    </div>
  );
}

export default MovieCard;