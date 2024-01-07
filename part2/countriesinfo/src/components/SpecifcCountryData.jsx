const SpecificCountryData = ({ countryData }) => {
  if (!countryData) {
    return <div>An error occured while getting the data of this country.</div>;
  }
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
};

export default SpecificCountryData;
