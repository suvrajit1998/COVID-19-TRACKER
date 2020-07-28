import React, { useState, useEffect } from 'react'
import './App.css'

import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import InfoBox from './components/InfoBox/InfoBox.component'
import Map from './components/Map/Map.component'
import Table from './components/Table/Table.coponent'
import LineGraph from './components/LineGraph/LineGraph.component'
import { sortData, preetyPrintStat } from './utils/util'
import 'leaflet/dist/leaflet.css'

function App() {
	const [countris, setCountris] = useState([])
	const [country, setCountry] = useState('WorldWide')
	const [countryInfo, setCountryInfo] = useState({})
	const [tableData, setTableData] = useState([])
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
	const [mapZoom, setMapZoom] = useState(3)
	const [mapCountries, setMapCountries] = useState([])
	const [casesType, setCasesType] = useState('cases')

	useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all')
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data)
			})
	}, [])

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries')
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}))

					const sortedData = sortData(data)

					setTableData(sortedData)
					setMapCountries(data)
					setCountris(countries)
				})
		}
		getCountriesData()
	}, [])

	const onCountryChange = async (e) => {
		const countryCode = e.target.value

		const url =
			countryCode === 'WorldWide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountry(countryCode)
				setCountryInfo(data)
				if (countryCode !== 'WorldWide') {
					setMapCenter([data.countryInfo.lat, data.countryInfo.long])
				}
				setMapZoom(4)
			})
	}

	return (
		<div className='app'>
			<div className='app__left'>
				<div className='app__header'>
					<h1>COVID-19 TRACKER</h1>
					<FormControl className='app__dropdown'>
						<Select variant='outlined' value={country} onChange={onCountryChange}>
							<MenuItem value='WorldWide'> WorldWide </MenuItem>
							{countris.map((country) => (
								<MenuItem key={country.value} value={country.value}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className='app__stats'>
					<InfoBox
						isRed
						active={casesType === 'cases'}
						onClick={() => setCasesType('cases')}
						title='Coronavirus Cases'
						total={preetyPrintStat(countryInfo.cases)}
						cases={preetyPrintStat(countryInfo.todayCases)}
					/>
					<InfoBox
						active={casesType === 'recovered'}
						onClick={() => setCasesType('recovered')}
						title='Recovered'
						total={preetyPrintStat(countryInfo.recovered)}
						cases={preetyPrintStat(countryInfo.todayRecovered)}
					/>
					<InfoBox
						isRed
						active={casesType === 'deaths'}
						onClick={() => setCasesType('deaths')}
						title='Deaths'
						total={preetyPrintStat(countryInfo.deaths)}
						cases={preetyPrintStat(countryInfo.todayDeaths)}
					/>
				</div>
				<Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
			</div>
			<Card className='app__right'>
				<CardContent>
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
					<h3 className='app_graphTitle'>Worldwide new {casesType}</h3>
					<LineGraph casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	)
}

export default App
