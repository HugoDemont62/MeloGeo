// Map.js
'use client'
import * as React from 'react';
import {useEffect, useState} from "react";
import MapboxComponent from "@/components/mapbox/MapboxComponent";
import {Button, Grid} from "@mui/material";
import MenuComponent from "@/components/menu/MenuComponent";
import Slide from '@mui/material/Slide';
import CityDetailsComponent from "@/components/menu/menu-parts/CityDetailsComponent";

const Map = () => {

    const [clickedElement, setClickedElement] = useState([]);
    const [cityName, setCityName] = useState('');
    const [checked, setChecked] = useState(false);
    const [menuCity, setMenuCity] = useState(false)
    const [mapRef, setMapRef] = useState(null);
    const [selectedTree, setSelectedTree] = useState(null);


    useEffect(() => {

        console.log(menuCity)
        if(clickedElement.length === 2 || selectedTree ) {
            setChecked(true);
        } else {
            setChecked(false);
        }
        if(!selectedTree){
        if (clickedElement.length === 0 && cityName !== '') {
            setMenuCity(true)
        } else {
            setMenuCity(false)
        }
        }


    },[clickedElement]);


    return (
        <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <div style={{width: '100%', height: '100%'}}>
                <MapboxComponent
                    setClickedElement={setClickedElement}
                    setCityName={setCityName}
                    setMapRef={setMapRef}
                    selectedTree={selectedTree}
                />
            </div>
            <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
                <div style={{position: 'absolute', right: '0', top: '0', width: '400px', height: '100%'}}>
                    <MenuComponent
                        clickedElement={clickedElement}
                        cityName={cityName}
                        mapRef={mapRef}
                        setSelectedTree={setSelectedTree}
                    />
                </div>
            </Slide>
            <Slide direction="left" in={menuCity} mountOnEnter unmountOnExit>
                <div style={{position: 'absolute', right: '0', top: '0', width: 'fit-content', height: '100%'}}>
                    <CityDetailsComponent cityName={cityName}/>
                </div>
            </Slide>
        </div>
    );
};

export default Map;
