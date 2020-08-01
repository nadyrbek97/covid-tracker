import  React, {useState, useEffect} from 'react';
import { FormControl, Select, MenuItem, Card, CardContent, Typography } from "@material-ui/core";
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";

function App() {

    // USE_EFFECT = Runs a piece of code based on a give condition
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);

    useEffect( () => {
       fetch("https://disease.sh/v3/covid-19/all")
           .then(response => response.json())
           .then((data) => {
               setCountryInfo(data);
           })
    });

    useEffect( () => {
        // The code inside here will run once
        // when the components and not again
        // async -> send a request, wait for it, do something
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map( (country) => (
                        {
                            name: country.country,
                            value: country.countryInfo.iso2
                        }
                    ));
                    setCountries(countries);
                })
        };

        getCountriesData();

    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        setCountry(countryCode);

        const url = countryCode === 'worldwide'
            ? 'https://disease.sh/v3/covid-19/all'
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then(resopnse => resopnse.json())
            .then(data => {
                setCountry(countryCode);
                // All of the data ..
                // from the country response
                setCountryInfo(data);
                setTableData(countries);
            })
    };

  return (
    <div className="app">
        <div className="app__left">
            {/*  Header */}
            {/*  Title + Select input dropdown field */}
            <div className="app__header">
                <h1>COVID-2019 TRACKER</h1>
                <FormControl className="app__dropdown">
                    <Select variant="outlined" value={country} onChange={onCountryChange}>
                        <MenuItem value="worldwide">Worldwide</MenuItem>
                        {countries.map((country) => (
                            <MenuItem value={country.value}>{country.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {/* InfoBox */}
            <div className="app__stats">
                <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
                <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
                <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
            </div>

            {/*  Map */}
            <div>
                <Map/>
            </div>
        </div>

        <Card className="app__right">
            <CardContent>
                {/*  Table  */}
                <Table countries={countries} />
                {/*  Graph  */}
                <h3>Graph for rendering some piece of information</h3>
            </CardContent>
        </Card>
    </div>
  );
}

export default App;
