const Filter = ({ searchQuery, handleSearchQueryChange }) => (
  <div>
    filter shown with:{" "}
    <input id="search" value={searchQuery} onChange={handleSearchQueryChange} />
  </div>
);

export default Filter;
