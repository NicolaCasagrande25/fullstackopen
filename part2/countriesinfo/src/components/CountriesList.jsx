const CountriesList = ({ countries, countryData, getSpecificCountryData }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map((country) => (
          <div key={country.cca2}>{country.name.common}</div>
        ))}
      </div>
    );
  } else if (countries.length === 1) {
    getSpecificCountryData(countries[0]);
    if (countryData === null) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h1>{countryData.name.common}</h1>
          <div>
            {`capital
            ${
              countryData.capital.length === 0
                ? "no capital was found"
                : countryData.capital[0]
            }`}
          </div>
          <div>area {countryData.area}</div>
          <h3>languages:</h3>
          <ul>
            {Object.values(countryData.languages).map((language) => {
              return <li key={language}>{language}</li>;
            })}
          </ul>
          <img
            src={countryData.flags.png}
            alt={countryData.flags.alt}
            width="250"
          />
        </div>
      );
    }
  }
};

export default CountriesList;
