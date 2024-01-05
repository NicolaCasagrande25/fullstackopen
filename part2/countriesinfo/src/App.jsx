import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CountriesList from "./components/CountriesList";
import countriesService from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    countriesService.getAll().then((countries) => {
      setCountries(countries);
    });
  }, []);

  const getSpecificCountryData = (country) => {
    countriesService.getCountryData(country.name.common).then((countryData) => {
      setCountryData(countryData);
    });
  };

  if (!countries) {
    return <div>Loading...</div>;
  }

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    if (countriesToShow.length != 1) {
      setCountryData(null);
    }
  };

  return (
    <div>
      <SearchBar
        searchQuery={searchQuery}
        handleSearchQueryChange={handleSearchQueryChange}
      />
      <CountriesList
        countries={countriesToShow}
        countryData={countryData}
        getSpecificCountryData={getSpecificCountryData}
      ></CountriesList>
    </div>
  );
};

export default App;
