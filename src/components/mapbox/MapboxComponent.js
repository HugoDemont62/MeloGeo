import "mapbox-gl/dist/mapbox-gl.css";
import * as React from 'react';
import Map, {GeolocateControl, Layer, Marker, NavigationControl, Source} from 'react-map-gl';
import {useCallback, useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import apiManager from "../../services/api-manager";


export default function MapboxComponent({setClickedElement, setCityName, setWeatherData, setAirPollution,  setMapRef, selectedTree, setMarkers, markers, heatPointId, isCured}) {
    const tokenMapbox = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const tokenOWeather = process.env.NEXT_PUBLIC_OWEATHER_TOKEN;
    const mapRef = useRef();
    const [clickedLngLat, setClickedLngLat] = useState(null);
    const [markersWeather, setMarkersWeather] = useState([]);

    const cities = [
        { name: "Paris", region: "Île-de-France" },
        { name: "Marseille", region: "Provence-Alpes-Côte d'Azur" },
        { name: "Lyon", region: "Auvergne-Rhône-Alpes" },
        { name: "Toulouse", region: "Occitanie" },
        { name: "Nice", region: "Provence-Alpes-Côte d'Azur" },
        { name: "Nantes", region: "Pays de la Loire" },
        { name: "Montpellier", region: "Occitanie" },
        { name: "Strasbourg", region: "Grand Est" },
        { name: "Bordeaux", region: "Nouvelle-Aquitaine" },
        { name: "Lille", region: "Hauts-de-France" },
        { name: "Rennes", region: "Bretagne" },
        { name: "Reims", region: "Grand Est" },
        { name: "Saint-Étienne", region: "Auvergne-Rhône-Alpes" },
        { name: "Le Havre", region: "Normandie" },
        { name: "Toulon", region: "Provence-Alpes-Côte d'Azur" },
        { name: "Grenoble", region: "Auvergne-Rhône-Alpes" },
        { name: "Dijon", region: "Bourgogne-Franche-Comté" },
        { name: "Angers", region: "Pays de la Loire" },
        { name: "Nîmes", region: "Occitanie" },
        { name: "Aix-en-Provence", region: "Provence-Alpes-Côte d'Azur" }
    ];

    const getWeatherByCities = () => {
        cities.forEach((city) => {
            apiManager.getWeatherByCity(city.name, tokenOWeather).then(data => {
                console.log(data);
                markersWeather.push(data);
            });
        })
    }

    useEffect(() => {
        getWeatherByCities()
    }, [])

    // Gestion des états des données
    useEffect(() => {
        if(clickedLngLat) {
            // Récupération du nom de ville selon ses coordonnees
            apiManager.getCityByLngLat(clickedLngLat.lng, clickedLngLat.lat, tokenMapbox)
                .then(data => {
                    const cityName = data.features[0].properties.name;
                    setCityName(cityName);
                    return apiManager.getWeatherByCity(cityName, tokenOWeather);
                })
                .then(weatherData => {
                    setWeatherData(weatherData);
                })
                .catch(err => console.error(err));

            apiManager.getAirPollution(clickedLngLat.lng, clickedLngLat.lat, tokenOWeather)
                .then(data => {
                    setAirPollution(data)
                }).catch(err => console.log(err))
        }
    }, [clickedLngLat]);

    useEffect(() => {
        setMapRef(mapRef);
    }, [mapRef]);

    useEffect(() => {
        console.log(isCured)
    }, [isCured]);

    // Configuration de la carte
    const DynamicGeocoder = dynamic(() => import('@mapbox/search-js-react').then(mod => mod.Geocoder), {
        ssr: false
    });

    const handleClick = useCallback((event) => {
        if(mapRef.current) {
            const features = mapRef.current.queryRenderedFeatures(event.point);
            setClickedElement(features);
            setClickedLngLat(event.lngLat);
        }
    }, []);

    const handleDoubleClick = useCallback((event) => {
                const newMarker = {
                    id: Date.now(),
                    longitude: event.lngLat.lng,
                    latitude: event.lngLat.lat,
                };
                setMarkers(prevMarkers => [...prevMarkers, newMarker]);
    }, [selectedTree]);


    const handleClickMarker = useCallback((event) => {
        console.log(event);
    }, []);

    return (
        <div style={{cursor:'crosshair'}}>
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: 4.8357,
                    latitude: 45.7640,
                    zoom: 11
                }}
                // onMouseMove={handleMouseMove}
                onClick={handleClick}
                onDblClick={handleDoubleClick}
                doubleClickZoom={false}
                mapboxAccessToken={tokenMapbox}
                style={{width: '100%', height: '100vh'}}
                mapStyle="mapbox://styles/mapbox/navigation-day-v1"
            >
                <GeolocateControl position="bottom-left"/>
                <NavigationControl position="bottom-left"/>
                {markers.map(marker => (
                    <Marker
                        draggable
                        onClick={handleClickMarker}
                        key={marker.id}
                        longitude={marker.longitude}
                        latitude={marker.latitude}
                        anchor="bottom"
                    >
                    </Marker>
                ))}
                {markersWeather.map(weather => (
                    <Marker
                        onClick={handleClickMarker}
                        longitude={weather.coord.lon}
                        latitude={weather.coord.lat}
                        anchor="bottom"
                    >
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt="weather icon"
                            style={{width: '40px', height: '40px'}}
                        />
                    </Marker>
                ))}
            </Map>
        </div>
    );
}
