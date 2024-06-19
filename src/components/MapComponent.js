'use client'

import React, { useEffect } from 'react';

const MapComponent = () => {
    useEffect(() => {
        const leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCss);

        const leafletJs = document.createElement('script');
        leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletJs.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        leafletJs.crossOrigin = '';
        leafletJs.async = true;
        leafletJs.onload = initializeMap;
        document.body.appendChild(leafletJs);

        function initializeMap() {
            var map = L.map('map').setView([51.505, -0.09], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            L.marker([51.5, -0.09]).addTo(map)
                .bindPopup('A pretty CSS popup.<br> Easily customizable.')
                .openPopup();
        }

        return () => {
            document.head.removeChild(leafletCss);
            document.body.removeChild(leafletJs);
        };
    }, []);

    return (
        <div id="map" style={{ height: '400px' }}></div>
    );
};

export default MapComponent;
