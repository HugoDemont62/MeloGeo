import "mapbox-gl/dist/mapbox-gl.css";
import * as React from 'react';
import Map, {GeolocateControl, Marker, NavigationControl} from 'react-map-gl';
import {useCallback, useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import apiManager from "../../services/api-manager";
import * as Tone from 'tone';
import WaveBarComponent from '@/components/wave-bar/WaveBarComponent';

export default function MapboxComponent({setClickedElement, weatherData, setCityName, setWeatherData, setAirPollution,  setMapRef, selectedTree, setMarkers, markers, isCured}) {
    const tokenMapbox = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const tokenOWeather = process.env.NEXT_PUBLIC_OWEATHER_TOKEN;
    const mapRef = useRef();
    const [clickedLngLat, setClickedLngLat] = useState(null);
    const [markersWeather, setMarkersWeather] = useState([]);
    const [activeSoundPlayer, setActiveSoundPlayer] = useState(null);
    const [synth, setSynth] = useState(null);

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
                setMarkersWeather(prevMarkersWeather => [...prevMarkersWeather, data]);
            });
        });
    }

    useEffect(() => {
        getWeatherByCities()
    }, [])

    useEffect(() => {
        if(weatherData) {
            playSoundForWeather(weatherData.weather[0].main)
        }
    }, [weatherData]);

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


    // Configuration de la carte
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
    }

    const stopActiveSound = () => {
        if (activeSoundPlayer) {
            activeSoundPlayer.stop();
            activeSoundPlayer.dispose();
        }
    };

    const playSoundForWeather = (weatherType) => {
        switch (weatherType) {
            case 'Clear':
                // Son pour une météo ensoleillée : Synthé léger et brillant
                const synth = new Tone.Synth().toDestination();
                synth.triggerAttackRelease('C4', '8n');
                playSunnyAmbience();
                setSynth(synth);
                break;
            case 'Rain':
                // Son pour la pluie : Percussion (hi-hat ou caisse claire)
                const rainSampler = new Tone.MembraneSynth().toDestination();
                rainSampler.triggerAttackRelease('C2', '8n');
                playRainyAmbience()
                setSynth(rainSampler);
                break;
            case 'Clouds':
                // Son pour un ciel nuageux : Synthé léger
                const cloudSynth = new Tone.FMSynth().toDestination();
                cloudSynth.triggerAttackRelease('E3', '8n');
                setSynth(cloudSynth);
                break;
            case 'Snow':
                // Son pour la neige : Sons scintillants, clochettes
                const snowSynth = new Tone.Synth({
                    oscillator: { type: 'triangle' }
                }).toDestination();
                snowSynth.triggerAttackRelease('G4', '8n');
                setSynth(snowSynth);
                break;
            case 'Thunderstorm':
                // Son pour l'orage : Bruit grave ou tonnerre
                const thunderNoise = new Tone.Noise("pink").start();
                const thunderFilter = new Tone.Filter(800, "lowpass").toDestination();
                thunderNoise.connect(thunderFilter);
                thunderNoise.stop("+0.5");
                setSynth(thunderNoise);
                break;
            case 'Drizzle':
                // Son pour la bruine : Sons doux, très légers (cymbales)
                const drizzleSynth = new Tone.NoiseSynth().toDestination();
                drizzleSynth.triggerAttackRelease('8n');
                setSynth(drizzleSynth);
                break;
            case 'Wind':
                // Son pour le vent : Instruments à vent
                const windSynth = new Tone.Synth({
                    oscillator: { type: 'sine' }
                }).toDestination();
                windSynth.triggerAttackRelease('A3', '8n');
                setSynth(windSynth);
                break;
            default:
                // Son par défaut
                const defaultSynth = new Tone.Synth().toDestination();
                defaultSynth.triggerAttackRelease('B4', '8n');
                setSynth(defaultSynth);
                break;
        }
    };



    return (
        <div style={{ cursor: 'crosshair' }}>
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
                style={{width: '100%', height: '100vh'}}
                mapStyle="mapbox://styles/mapbox/navigation-day-v1"
            >
                <GeolocateControl position="bottom-left"/>
                <NavigationControl position="bottom-left"/>
                {markers.map(marker => (
                    <Marker
                        draggable
                        // onClick={handleClickMarker}
                        key={marker.id}
                        longitude={marker.longitude}
                        latitude={marker.latitude}
                        anchor="bottom"
                    >
                    </Marker>
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
                            style={{width: '40px', height: '40px'}}
                        />
                    </Marker>
                ))}
                <WaveBarComponent synth={synth} />
            </Map>

        </div>
    );
}
