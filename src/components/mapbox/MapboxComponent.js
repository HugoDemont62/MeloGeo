import "mapbox-gl/dist/mapbox-gl.css";
import * as React from 'react';

import Map, {GeolocateControl, Marker, NavigationControl} from 'react-map-gl';
import {useCallback, useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import apiManager from "../../services/api-manager";
import * as Tone from 'tone';
import WaveBarComponent from '@/components/wave-bar/WaveBarComponent';

// export default function MapboxComponent({setClickedElement, weatherData, setCityName, setWeatherData, setAirPollution,  setMapRef, selectedTree, setMarkers, markers, isCured}) {
// =======
// import Map, { GeolocateControl, Marker, NavigationControl } from 'react-map-gl';
// import { useCallback, useEffect, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import apiManager from "../../services/api-manager";
// import * as Tone from 'tone';

export default function MapboxComponent({ setClickedElement, weatherData, setCityName, setWeatherData, setAirPollution, setMapRef, selectedTree, setMarkers, markers, isCured }) {

    const tokenMapbox = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const tokenOWeather = process.env.NEXT_PUBLIC_OWEATHER_TOKEN;
    const mapRef = useRef();
    const [clickedLngLat, setClickedLngLat] = useState(null);
    const [markersWeather, setMarkersWeather] = useState([]);
    const [synth, setSynth] = useState(null);
    const [ambiancePlayer, setAmbiancePlayer] = useState(null);
    const [voyagePlayer, setVoyagePlayer] = useState(null);
    const [voyageInterval, setVoyageInterval] = useState(null);
    const [markersList, setMarkersList] = useState([]);
    const [isVoyageStarted, setIsVoyageStarted] = useState(false);
    const isVoyageStartedRef = useRef(isVoyageStarted);
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

    // Fonction pour supprimer ou réinitialiser markersList
    const clearMarkersList = () => {
        setMarkersList([]); // Réinitialise l'état à une liste vide
    };

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
            if (ambiancePlayer) {
                stopAmbiancePlayer();
            }
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
        setMarkersList(prevMarkersList => [...prevMarkersList, newMarker]);
    }, [selectedTree]);

    const playSunnyAmbience = () => {
        setAmbiancePlayer(new Tone.Player({
            url: "/sons/sunny-ambiance.mp3",
            loop: true,
            autostart: true,
            volume: -10,
        }).toDestination());
    };

    const playRainyAmbience = () => {
        setAmbiancePlayer(new Tone.Player({
            url: "/sons/rain-ambiance.mp3",
            loop: true,
            autostart: true,
            volume: -10,
        }).toDestination());
    };

    const playSoundForWeather = (weatherType) => {
        stopAmbiancePlayer();

            switch (weatherType) {
                case 'Clear':
                    const sunnySynth = new Tone.Synth().toDestination();
                    sunnySynth.triggerAttackRelease('C4', '8n');
                    setSynth(sunnySynth);
                    if (!isVoyageStartedRef.current) {
                        playSunnyAmbience(); // Only play ambiance if voyage is not started
                    }
                    break;
                case 'Rain':
                    const rainSampler = new Tone.MembraneSynth().toDestination();
                    rainSampler.triggerAttackRelease('C2', '8n');
                    setSynth(rainSampler);
                    break;
                case 'Clouds':
                    const cloudSynth = new Tone.FMSynth().toDestination();
                    cloudSynth.triggerAttackRelease('E3', '8n');
                    setSynth(cloudSynth);
                    break;
                case 'Snow':
                    const snowSynth = new Tone.Synth({
                        oscillator: { type: 'triangle' }
                    }).toDestination();
                    snowSynth.triggerAttackRelease('G4', '8n');
                    setSynth(snowSynth);
                    break;
                case 'Thunderstorm':
                    const thunderNoise = new Tone.Noise("pink").start();
                    const thunderFilter = new Tone.Filter(800, "lowpass").toDestination();
                    thunderNoise.connect(thunderFilter);
                    thunderNoise.stop("+0.5");
                    setSynth(thunderNoise);
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
    
    useEffect(() => {
        console.log("État de markersList:", markersList);
    }, [markersList]);
    

    useEffect(() => {
        if (isVoyageStarted) {
           stopAmbiancePlayer();
        }
    }, [isVoyageStarted]);

    const startVoyage = () => {
        // Vérifie si le voyage est déjà commencé avant d'exécuter le reste
        playPercussionLoop()
        if (isVoyageStartedRef.current) return;

        // Démarre le voyage
        setIsVoyageStarted(true);
        isVoyageStartedRef.current = true; // Met à jour la référence

        if (markersList.length === 0) return;

        Tone.start().then(() => {
            let localIndex = 0;

            // Assurez-vous d'arrêter le voyage en cours s'il existe déjà un intervalle
            if (voyageInterval) {
                clearInterval(voyageInterval);
                setVoyageInterval(null);
            }

            const intervalId = setInterval(() => {
                if (localIndex >= markersList.length) {
                    clearInterval(intervalId);
                    setVoyageInterval(null);
                    stopVoyagePlayer();  // Arrêter la boucle de percussions
                    setIsVoyageStarted(false);  // Voyage terminé
                    isVoyageStartedRef.current = false; // Met à jour la référence
                    return;
                }

                const marker = markersList[localIndex];

                apiManager.getCityByLngLat(marker.longitude, marker.latitude, tokenMapbox)
                    .then(cityResponse => {
                        const cityName = cityResponse.features[0].properties.name;
                        return apiManager.getWeatherByCity(cityName, tokenOWeather);
                    })
                    .then(weatherData => {
                        if (weatherData && weatherData.weather && weatherData.weather.length > 0) {
                            playSoundForWeather(weatherData.weather[0].main);
                        } else {
                            console.error('Weather data is not in the expected format:', weatherData);
                        }

                        mapRef.current?.flyTo({
                            center: [marker.longitude, marker.latitude],
                            zoom: 10,
                        });

                        localIndex++;
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error);
                    });
            }, 2000);  // Intervalle de 2 secondes entre chaque marker

            setVoyageInterval(intervalId);
        });
    };

    const playPercussionLoop = () => {
        const kick = new Tone.MembraneSynth().toDestination();
        const snare = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
        }).toDestination();
        const hiHat = new Tone.MetalSynth({
            frequency: 400,
            envelope: {
                attack: 0.001,
                decay: 0.1,
                release: 0.01,
            },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 8000,
            octaves: 1.5,
        }).toDestination();

        const pattern = new Tone.Pattern((time, note) => {
            if (note === 'kick') {
                kick.triggerAttackRelease('C2', '8n', time);
                setSynth(kick);
            } else if (note === 'snare') {
                snare.triggerAttackRelease('8n', time);
                setSynth(snare);
            } else if (note === 'hihat') {
                hiHat.triggerAttackRelease('16n', time);
                setSynth(hiHat);
            }
        }, ['kick', 'hihat', 'snare', 'hihat'], 'up').start(0);

        Tone.Transport.bpm.value = 120;
        Tone.Transport.start();
        setVoyagePlayer(pattern);
    };

    const stopVoyage = () => {
        // Arrêter le player de voyage
        stopVoyagePlayer();

        // Si un intervalle est en cours, l'arrêter
        if (voyageInterval) {
            clearInterval(voyageInterval);
            setVoyageInterval(null); // Réinitialiser la référence de l'intervalle
        }

        // Réinitialiser les états du voyage
        setIsVoyageStarted(false);
        isVoyageStartedRef.current = false; // Mettre à jour la référence du voyage
        setMarkersList([]); // Optionnel : Réinitialiser la liste des marqueurs
    };

    const supprimerVoyage = () => {
        markersList.delete();
    }

    const stopAmbiancePlayer = () => {
        if (ambiancePlayer) {
            ambiancePlayer.stop();
            ambiancePlayer.disconnect();
        }
    };

    const stopVoyagePlayer = () => {
        if (voyagePlayer) {
            voyagePlayer.stop();
            voyagePlayer.dispose();
        }
    };



    return (

        <div style={{ cursor: 'crosshair' }}>
        <div style={{ position: 'relative', height: '100vh' }}>
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 1,
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
                <button onClick={startVoyage}>Démarrer le voyage</button>
                <button onClick={stopVoyage}>Arrêter le voyage</button>
                <button onClick={clearMarkersList}>Supprimer les marqueurs</button>
                <input type="range" min="20" max="1000" step="1"
                       value={Tone.Transport.bpm.value}
                       onChange={(e) => Tone.Transport.bpm.value = e.target.value}/>
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
                {markersList.map(marker => (
                    <Marker
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

                <WaveBarComponent synth={synth} />

            </Map>
        </div>
        </div>
    );
}
