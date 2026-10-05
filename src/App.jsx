import { useState } from "react";
import { API_KEY } from "./config";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieGrid from "./components/MovieGrid";

function App(){
  const [movies, setMovies] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [cast, setCast] = useState([]);
  const [error, setError] = useState('');
  
  async function getActors(movieId){
    try{
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
      const data = await response.json();
      setCast(data.cast.slice(0, 5).map(actors => actors.name));
    } catch(err){
      setCast([]);
      console.log(err.message);
    }
  }
  async function getMovie(){
    if(!userInput.trim()) return;
    setCast([]);
    setError('');
    try{
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(userInput)}`
      );
      const data = await response.json();
      setMovies(data.results);
      if(data.results.length > 0){
        getActors(data.results[0].id);
      }
    } catch(err) {
      setError(err.message);
    }
  }


  return (
    <div className="container">
      <SearchBar value={userInput} onChange={setUserInput} onSearch={getMovie} />
      {error && <p className="error">{error}</p>}
      {movies.length > 0 && (
        <MovieCard movie={movies[0]} cast={cast} variant="main" />
      )}
      <MovieGrid movies={movies.slice(1)} />
    </div>
  );
}

export default App;