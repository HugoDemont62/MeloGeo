// Map.js
'use client';
import * as React from 'react';
import {useEffect, useState} from 'react';
import MapboxComponent from '@/components/mapbox/MapboxComponent';
import Slide from '@mui/material/Slide';
import CityDetailsComponent
  from '@/components/menu/menu-parts/CityDetailsComponent';
import HowItWorksComponent
  from '@/components/menu/menu-parts/HowItWorksComponent';
import './page.css';
import MaintenanceBanner from "@/app/MaintenanceBanner";
import IntroPopup from "@/app/introPopup";

const Map = () => {

  const [clickedElement, setClickedElement] = useState([]);
  // Appels API
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState(0);
  const [airPollution, setAirPollution] = useState(0);
  // Gestion des états des menus
  const [menuCity, setMenuCity] = useState(false);
  const [introPopup, setIntroPopup] = useState(true);
  // États et données de la carte
  const [mapRef, setMapRef] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (cityName !== '') {
      setMenuCity(true);
    } else {
      setMenuCity(false);
    }
    setIntroPopup(false);
  }, [clickedElement, cityName]);

  useEffect(() => {
    if (mapRef) {
      setIntroPopup(true);
    }
  }, [mapRef]);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh', // L'ensemble du contenu occupe toute la hauteur
        overflow: 'hidden',
      }}
    >
      {/*<IntroPopup/>*/}
      <MaintenanceBanner />
      {/* Section carte : prend 75% de la largeur */}
      <div style={{ flex: 3, position: 'relative', height: '100%' }}>
        <MapboxComponent
          setClickedElement={setClickedElement}
          weatherData={weatherData}
          setMenuCity={setMenuCity}
          setCityName={setCityName}
          setWeatherData={setWeatherData}
          setAirPollution={setAirPollution}
          setMapRef={setMapRef}
          setMarkers={setMarkers}
          markers={markers}
        />
      </div>

      {/* Section des panneaux : prend 25% de la largeur */}
      {/* Composant CityDetailsComponent */}
      {menuCity && (
        <div className="panel city-details">
          <CityDetailsComponent
            cityName={cityName}
            weatherData={weatherData}
            airPollution={airPollution}
          />
        </div>
      )}

      {/* Composant HowItWorksComponent */}
      {introPopup && (
        <div className="panel how-it-works">
          <HowItWorksComponent />
        </div>
      )}
    </div>
  );
};

export default Map;
