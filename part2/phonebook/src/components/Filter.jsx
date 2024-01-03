const Filter = ({ searchQuery, handleSearchQueryChange }) => (
  <div>
    filter shown with:{" "}
    <input value={searchQuery} onChange={handleSearchQueryChange} />
  </div>
);

export default Filter;
