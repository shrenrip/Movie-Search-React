function SearchBar({ value, onChange, onSearch}){
  return (
    <div className="searchBox">
      <input 
        type="text" 
        placeholder="Enter name of movie" 
        className="textBox"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {if(e.key === 'Enter') onSearch(); }}
      ></input>
      <button onClick={() => onSearch()}>Search</button>
    </div>
  )
}

export default SearchBar;