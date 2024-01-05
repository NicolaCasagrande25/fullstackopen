const SearchBar = ({ searchQuery, handleSearchQueryChange }) => {
  return (
    <div>
      <span>find countries</span>
      <input id="searchBar" value={searchQuery} onChange={handleSearchQueryChange} />
    </div>
  );
};

export default SearchBar;
