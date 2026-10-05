import MovieCard from "./MovieCard";

function MovieGrid({ movies }){
  return (
    <div className="alternativeMovieCards">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} variant="alternative" />
      ))}
    </div>
  );
}

export default MovieGrid;