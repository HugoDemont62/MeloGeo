// Map.js
'use client'
import * as React from 'react';
import {useEffect, useState} from "react";
import MapboxComponent from "@/components/mapbox/MapboxComponent";
import {Button, Grid} from "@mui/material";
import MenuComponent from "@/components/menu/MenuComponent";
import Slide from '@mui/material/Slide';

const Map = () => {

    const [clickedElement, setClickedElement] = useState([]);
    const [cityName, setCityName] = useState('');
    const [checked, setChecked] = useState(false);
    const [mapRef, setMapRef] = useState(null);
    const [selectedTree, setSelectedTree] = useState(null);


    useEffect(() => {
        if(clickedElement.length > 0 || cityName !== '' ) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    },[clickedElement]);


    return (
        <Grid container>
            <Grid item xs>
                <MapboxComponent setClickedElement={setClickedElement} setCityName={setCityName} setMapRef={setMapRef} selectedTree={selectedTree}/>
            </Grid>
                <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
                <Grid item xs={4}>
                    <MenuComponent clickedElement={clickedElement} cityName={cityName} mapRef={mapRef} setSelectedTree={setSelectedTree}/>
                </Grid>
                </Slide>
        </Grid>
    );
};

export default Map;
