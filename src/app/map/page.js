// Map.js
import React from 'react';
import MapboxComponent from "@/components/mapbox/MapboxComponent";

const Map = () => {
    return (
        <div style={{cursor: 'crosshair'}}>
            <h1>Carte</h1>
            <MapboxComponent/>
        </div>
    );
};

export default Map;
