// Map.js
'use client'
import * as React from 'react';
import {useEffect, useState} from "react";
import MapboxComponent from "@/components/mapbox/MapboxComponent";
import MenuComponent from "@/components/menu/MenuComponent";
import Slide from '@mui/material/Slide';
import CityDetailsComponent from "@/components/menu/menu-parts/CityDetailsComponent";
import HowItWorksComponent from "@/components/menu/menu-parts/HowItWorksComponent";

const Map = () => {

    const [clickedElement, setClickedElement] = useState([]);
    // Appels API
    const [cityName, setCityName] = useState('');
    const [weatherData, setWeatherData] = useState(0)
    // Gestion des états des menus
    const [checked, setChecked] = useState(false);
    const [menuCity, setMenuCity] = useState(false)
    const [simularbrePopup, setSimularbrePopup] = useState(true);
    // États et données de la carte
    const [mapRef, setMapRef] = useState(null);
    const [selectedTree, setSelectedTree] = useState(null);
    const [markers, setMarkers] = useState([]);
    // Propriétés point de chaleur
    const [currentHeatPoint, setCurrentHeatPoint] = useState(null)
    const [temperature, setTemperature] = useState(0)
    const [treesNeeded, setTreesNeeded] = useState(0)
    const [heatPointId, setHeatPointId] = useState(0)


    useEffect(() => {
        if(clickedElement) {
            if (clickedElement.length === 2 || selectedTree) {
                if(clickedElement[0]) {
                    setHeatPointId(clickedElement[0].properties.id)
                    setTemperature(clickedElement[0].properties.temperature)
                    setTreesNeeded(clickedElement[0].properties.treesNeeded)
                    setCurrentHeatPoint(clickedElement[0])
                }
                setChecked(true);
            } else {
                setChecked(false);
            }
            if (!selectedTree) {
                if (clickedElement.length === 0 && cityName !== '') {
                    setMenuCity(true)
                } else {
                    setMenuCity(false)
                }
            }
            setSimularbrePopup(false)
        }
    },[clickedElement]);

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
                    setMapRef={setMapRef}
                    selectedTree={selectedTree}
                    setMarkers={setMarkers}
                    markers={markers}
                    heatPointId={heatPointId}
                />
            </div>
            <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
                <div style={{position: 'absolute', right: '0', top: '0', width: '400px', height: '100%'}}>
                    <MenuComponent
                        clickedElement={clickedElement}
                        cityName={cityName}
                        mapRef={mapRef}
                        setSelectedTree={setSelectedTree}
                        selectedTree={selectedTree}
                        treesNeeded={treesNeeded}
                        markers={markers}
                        heatPointId={heatPointId}
                    />
                </div>
            </Slide>
            <Slide direction="left" in={menuCity} mountOnEnter unmountOnExit>
                <div style={{position: 'absolute', right: '0', top: '0', width: 'fit-content', height: '100%'}}>
                    <CityDetailsComponent cityName={cityName} weatherData={weatherData}/>
                </div>
            </Slide>
            <Slide direction="left" in={simularbrePopup} mountOnEnter unmountOnExit>
                <div style={{position: 'absolute', right: '0', top: '0', width: 'fit-content', height: '100%'}}>
                    <HowItWorksComponent/>
                </div>
            </Slide>
        </div>
    );
};

export default Map;
