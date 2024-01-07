import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CountriesInfo from "./components/CountriesInfo";
import countriesService from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      await countriesService.getAll().then((countries) => {
        setCountries(countries);
      });
      setIsLoadingCountries(false);
    };

    fetchCountries();
  }, []);

  if (!countries) {
    return <div>An error occured while retrieving the countries.</div>;
  }

  if (isLoadingCountries) {
    return <div>Loading...</div>;
  }

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <SearchBar
        searchQuery={searchQuery}
        handleSearchQueryChange={handleSearchQueryChange}
      />
      <CountriesInfo countries={countriesToShow}></CountriesInfo>
    </div>
  );
};

export default App;
