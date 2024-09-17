// Map.js
'use client'
import * as React from 'react';
import {useEffect, useState} from "react";
import MapboxComponent from "@/components/mapbox/MapboxComponent";
import Slide from '@mui/material/Slide';
import CityDetailsComponent from "@/components/menu/menu-parts/CityDetailsComponent";
import HowItWorksComponent from "@/components/menu/menu-parts/HowItWorksComponent";

const Map = () => {

    const [clickedElement, setClickedElement] = useState([]);
    // Appels API
    const [cityName, setCityName] = useState('');
    const [weatherData, setWeatherData] = useState(0);
    const [airPollution, setAirPollution] = useState(0)
    // Gestion des états des menus
    const [menuCity, setMenuCity] = useState(false)
    const [simularbrePopup, setSimularbrePopup] = useState(true);
    // États et données de la carte
    const [mapRef, setMapRef] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        console.log(clickedElement)
                if (cityName !== '') {
                    setMenuCity(true)
                } else {
                    setMenuCity(false)
                }
            setSimularbrePopup(false)
    },[clickedElement, cityName]);

    useEffect(() => {
        if(mapRef) {
            setSimularbrePopup(true)
        }
    }, [mapRef])


    return (
        <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <div style={{width: '100%', height: '100%'}}>
                <MapboxComponent
                    setClickedElement={setClickedElement}
                    setCityName={setCityName}
                    setWeatherData={setWeatherData}
                    setAirPollution={setAirPollution}
                    setMapRef={setMapRef}
                    setMarkers={setMarkers}
                    markers={markers}
                />
            </div>
            <Slide direction="left" in={menuCity} mountOnEnter unmountOnExit>
                <div style={{position: 'absolute', right: '0', top: '0', width: 'fit-content', height: '100%', marginTop: 20, marginRight:20}}>
                    <CityDetailsComponent cityName={cityName} weatherData={weatherData} airPollution={airPollution}/>
                </div>
            </Slide>
            <Slide direction="left" in={simularbrePopup} mountOnEnter unmountOnExit>
                <div style={{position: 'absolute', right: '0', top: '0', width: 'fit-content', height: '100%', marginTop: 20, marginRight:20}}>
                    <HowItWorksComponent/>
                </div>
            </Slide>
        </div>
    );
};

export default Map;
