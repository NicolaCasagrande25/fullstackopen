import { useState, useEffect } from "react";
import SpecificCountryData from "./SpecifcCountryData";
import countriesService from "../services/countries";

const CountriesInfo = ({ countries }) => {
  const [countryData, setCountryData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showCountryData, setShowCountryData] = useState(false);

  const getSpecificCountryData = async (country) => {
    setIsLoadingData(true);
    await countriesService
      .getCountryData(country.name.common)
      .then((countryData) => {
        setCountryData(countryData);
      });
    setIsLoadingData(false);
    setShowCountryData(true);
  };

  useEffect(() => {
    if (countries.length === 1) {
      if(!countryData){
        getSpecificCountryData(countries[0]);
      }
    }
    else {
      setCountryData(null);
      setShowCountryData(false);
    }
  }, [countries]);

  if (isLoadingData) {
    return <div>Loading...</div>;
  }

  if (showCountryData) {
    return SpecificCountryData({ countryData });
  } else if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map((country) => (
          <div key={country.cca2}>
            <span>{country.name.common}</span>
            <button onClick={() => getSpecificCountryData(country)}>
              show
            </button>
          </div>
        ))}
      </div>
    );
  } else {
    return <div>No matches, specify another filter</div>;
  }
};

export default CountriesInfo;
