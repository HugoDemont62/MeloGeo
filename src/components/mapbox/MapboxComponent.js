import "mapbox-gl/dist/mapbox-gl.css";
import * as React from 'react';
import Map, { GeolocateControl, Marker, NavigationControl } from 'react-map-gl';
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import apiManager from "../../services/api-manager";
import * as Tone from 'tone';

export default function MapboxComponent({ setClickedElement, weatherData, setCityName, setWeatherData, setAirPollution, setMapRef, selectedTree, setMarkers, markers, isCured }) {
    const tokenMapbox = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const tokenOWeather = process.env.NEXT_PUBLIC_OWEATHER_TOKEN;
    const mapRef = useRef();
    const [clickedLngLat, setClickedLngLat] = useState(null);
    const [markersWeather, setMarkersWeather] = useState([]);
    const [activeSoundPlayer, setActiveSoundPlayer] = useState(null);
    const [voyageInterval, setVoyageInterval] = useState(null);
    const [markersList, setMarkersList] = useState([]);
    const [voyageIndex, setVoyageIndex] = useState(0);

    const cities = [
        // Your cities data
    ];

    const getWeatherByCities = () => {
        cities.forEach((city) => {
            apiManager.getWeatherByCity(city.name, tokenOWeather).then(data => {
                setMarkersWeather(prevMarkersWeather => [...prevMarkersWeather, data]);
            });
        });
    };

    useEffect(() => {
        getWeatherByCities();
    }, []);

    useEffect(() => {
        if (weatherData) {
            playSoundForWeather(weatherData.weather[0].main);
        }
    }, [weatherData]);

    useEffect(() => {
        if (clickedLngLat) {
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
                    setAirPollution(data);
                }).catch(err => console.log(err));
        }
    }, [clickedLngLat]);

    useEffect(() => {
        setMapRef(mapRef);
    }, [mapRef]);

    const DynamicGeocoder = dynamic(() => import('@mapbox/search-js-react').then(mod => mod.Geocoder), {
        ssr: false
    });

    const handleClick = useCallback((event) => {
        if (mapRef.current) {
            if (activeSoundPlayer) {
                stopActiveSound();
            }
            const features = mapRef.current.queryRenderedFeatures(event.point);
            setClickedElement(features);
            setClickedLngLat(event.lngLat);
        }
    }, [activeSoundPlayer]);

    const handleDoubleClick = useCallback((event) => {
        const newMarker = {
            id: Date.now(),
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
        };
        setMarkers(prevMarkers => [...prevMarkers, newMarker]);
        setMarkersList(prevMarkersList => [...prevMarkersList, newMarker]);
    }, [selectedTree]);

    const playSunnyAmbience = () => {
        setActiveSoundPlayer(new Tone.Player({
            url: "/sons/sunny-ambiance.mp3",
            loop: true,
            autostart: true,
            volume: -10,
        }).toDestination());
    };

    const playRainyAmbience = () => {
        setActiveSoundPlayer(new Tone.Player({
            url: "/sons/rain-ambiance.mp3",
            loop: true,
            autostart: true,
            volume: -10,
        }).toDestination());
    };

    const stopActiveSound = () => {
        if (activeSoundPlayer) {
            activeSoundPlayer.stop();
            activeSoundPlayer.dispose();
        }
    };

    const playSoundForWeather = (weatherType) => {
        switch (weatherType) {
            case 'Clear':
                const sunnySynth = new Tone.Synth().toDestination();
                sunnySynth.triggerAttackRelease('C4', '8n');
                break;
            case 'Rain':
                const rainSynth = new Tone.MembraneSynth().toDestination();
                rainSynth.triggerAttackRelease('C2', '8n');
                break;
            case 'Clouds':
                const cloudSynth = new Tone.FMSynth().toDestination();
                cloudSynth.triggerAttackRelease('E3', '8n');
                break;
            case 'Snow':
                const snowSynth = new Tone.Synth({
                    oscillator: { type: 'triangle' }
                }).toDestination();
                snowSynth.triggerAttackRelease('G4', '8n');
                break;
            case 'Thunderstorm':
                const thunderNoise = new Tone.Noise("pink").start();
                const thunderFilter = new Tone.Filter(800, "lowpass").toDestination();
                thunderNoise.connect(thunderFilter);
                thunderNoise.stop("+0.5");
                break;
            case 'Drizzle':
                const drizzleSynth = new Tone.NoiseSynth().toDestination();
                drizzleSynth.triggerAttackRelease('8n');
                break;
            case 'Wind':
                const windSynth = new Tone.Synth({
                    oscillator: { type: 'sine' }
                }).toDestination();
                windSynth.triggerAttackRelease('A3', '8n');
                break;
            default:
                const defaultSynth = new Tone.Synth().toDestination();
                defaultSynth.triggerAttackRelease('B4', '8n');
                break;
        }
    };

    const startVoyage = async () => {
        if (markersList.length === 0) return;
    
        Tone.start().then(() => {
            let localIndex = 0; // Utiliser une variable locale pour suivre l'index
    
            const intervalId = setInterval(async () => {
                if (localIndex >= markersList.length) {
                    clearInterval(intervalId);
                    setVoyageInterval(null);
                    return;
                }
    
                const marker = markersList[localIndex]; // Utiliser localIndex pour les marqueurs
                console.log('Fetching weather data for marker:', marker);
    
                try {
                    // Récupérer le nom de la ville en utilisant les coordonnées du marqueur
                    const cityResponse = await apiManager.getCityByLngLat(marker.longitude, marker.latitude, tokenMapbox);
                    const cityName = cityResponse.features[0].properties.name;
                    console.log('City Name:', cityName);
    
                    // Appeler l'API pour obtenir les données météo de cette ville
                    const weatherData = await apiManager.getWeatherByCity(cityName, tokenOWeather);
                    console.log('Weather Data:', weatherData);
    
                    if (weatherData && weatherData.weather && weatherData.weather.length > 0) {
                        playSoundForWeather(weatherData.weather[0].main);
                    } else {
                        console.error('Weather data is not in the expected format:', weatherData);
                    }
    
                    mapRef.current?.flyTo({
                        center: [marker.longitude, marker.latitude],
                        zoom: 10,
                    });
    
                    // Mettre à jour l'index local pour passer au marqueur suivant
                    localIndex++;
                    setVoyageIndex(localIndex); // Met à jour aussi l'état si vous en avez besoin
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                }
            }, 2000); // Ajustez le temps selon vos besoins
            setVoyageInterval(intervalId);
        });
    };
    
    

    const stopVoyage = () => {
        if (voyageInterval) {
            clearInterval(voyageInterval);
            setVoyageInterval(null);
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <button onClick={startVoyage}>Démarrer le voyage</button>
                <button onClick={stopVoyage}>Arrêter le voyage</button>
            </div>
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: 4.8357,
                    latitude: 45.7640,
                    zoom: 11
                }}
                onClick={handleClick}
                onDblClick={handleDoubleClick}
                doubleClickZoom={false}
                mapboxAccessToken={tokenMapbox}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/navigation-day-v1"
            >
                <GeolocateControl position="bottom-left" />
                <NavigationControl position="bottom-left" />
                {markers.map(marker => (
                    <Marker
                        draggable
                        key={marker.id}
                        longitude={marker.longitude}
                        latitude={marker.latitude}
                        anchor="bottom"
                    />
                ))}
                {markersWeather.map((weather, index) => (
                    <Marker
                        key={`${weather.coord.lat}-${weather.coord.lon}-${index}`}
                        longitude={weather.coord.lon}
                        latitude={weather.coord.lat}
                        anchor="center"
                    >
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt="weather icon"
                            style={{ width: '24px', height: '24px' }}
                        />
                    </Marker>
                ))}
            </Map>
        </div>
    );
}
