// Map.js
'use client'
import * as React from 'react';
import {useEffect, useState} from "react";
import MapboxComponent from "@/components/mapbox/MapboxComponent";
import {Button, Grid} from "@mui/material";
import MenuComponent from "@/components/mapbox/MenuComponent";
import Slide from '@mui/material/Slide';

const Map = () => {

    const [clickedElement, setClickedElement] = useState([]);
    const [cityName, setCityName] = useState('');
    const [checked, setChecked] = useState(false);
    const [draggedElement, setDraggedElement] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        if(clickedElement.length > 0 || cityName !== '' ) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    },[clickedElement]);

    useEffect(() => {
        console.log(draggedElement)
    },[draggedElement])

    return (
        <Grid container>
            <Grid item xs>
                <MapboxComponent setClickedElement={setClickedElement} setCityName={setCityName} setMapRef={setMapRef} markers={markers} checked={checked}/>
            </Grid>
                <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
                <Grid item xs={4}><MenuComponent clickedElement={clickedElement} cityName={cityName} setDraggedElement={setDraggedElement} mapRef={mapRef} setMarkers={setMarkers} markers={markers}/></Grid>
                </Slide>
        </Grid>
    );
};

export default Map;
