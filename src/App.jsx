import { useState } from "react";
import { API_KEY } from "./config";

function App(){
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');

  async function getMovie(userInput){
    if(!userInput.trim()) return;
    setLoading(true);
    setError('');
    try{
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${userInput}`
      );
      const data = await response.json();
      console.log(data);
      setMovies(data.results);

    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <div className="container">
    <div className="searchBox">
      <input 
        type="text" 
        placeholder="Enter name of movie/series" 
        className="textBox"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={e => {if(e.key === 'Enter') getMovie(userInput)}}
      ></input>
      <button onClick={() => { getMovie(userInput) }}>Search</button>
    </div>
    <div className="mainMovieCard">
      {movies.length > 0 && (
        <>
        <img src={`https://image.tmdb.org/t/p/w500${movies[0].poster_path}`}></img>
        <div className="mainMovieInfo">
          <p>Title: {movies[0].title}</p>
          <p>Release Date: {movies[0].release_date}</p>
          <p>Score: {movies[0].vote_average}</p>
          <p>Description: {movies[0].overview}</p>
        </div>
        </>
      )}
    </div>
    <div className="alternativeMovieCards">
      { movies
      .slice(1)
      .filter(movie => movie.poster_path)
      .map((movie) => (
          <div className="alternativeMovieCard" key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}></img>
            <p className="title">Title: {movie.title}</p>
            <p className="meta">Release Date: {movie.release_date}</p>
            <p className="meta">Score: {movie.vote_average}</p>
          </div>
      ))}
    </div>
  </div>
}

export default App