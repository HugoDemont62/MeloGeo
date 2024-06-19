'use client'
import * as React from 'react';
import Map from 'react-map-gl';

export default function MapboxComponent() {
    return (
        <Map
            mapboxAccessToken="pk.eyJ1IjoiZW5nZWxpYmVydHRvbSIsImEiOiJjbHhqM3RrY3AxazFuMnBzanR0cG15cnh2In0.s67XGhcaeWqxR8bNd1xe5Q"
            initialViewState={{
                longitude: -122.4,
                latitude: 37.8,
                zoom: 14
            }}
            style={{width: '100%', height: '100vh'}}
            mapStyle="mapbox://styles/mapbox/streets-v9"

        />
    )
}