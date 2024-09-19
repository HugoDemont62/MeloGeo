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
    const [isVoyageStarted, setIsVoyageStarted] = useState(false);

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
        console.log(activeSoundPlayer)
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
                if (!isVoyageStarted){
                playSunnyAmbience();}
                else {
                    stopActiveSound();
                }
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

    useEffect(() => {
        if (isVoyageStarted) {
           stopActiveSound();
        }
    }, [isVoyageStarted]);

    const startVoyage = async () => {
        if (markersList.length === 0) return;
        setIsVoyageStarted(true);
        Tone.start().then(() => {
            let localIndex = 0;
    
            playPercussionLoop(); // Démarrer la boucle de percussions ici
    
            const intervalId = setInterval(async () => {
                if (localIndex >= markersList.length) {
                    clearInterval(intervalId);
                    setVoyageInterval(null);
                    stopActiveSound(); // Arrêter la boucle de percussions
                    return;
                }
    
                const marker = markersList[localIndex];
                console.log('Fetching weather data for marker:', marker);
    
                try {
                    const cityResponse = await apiManager.getCityByLngLat(marker.longitude, marker.latitude, tokenMapbox);
                    const cityName = cityResponse.features[0].properties.name;
                    console.log('City Name:', cityName);
    
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
    
                    localIndex++;
                    setVoyageIndex(localIndex);
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                }
            }, 2000);
            setVoyageInterval(intervalId);
        });
    };
    
    const playGermanRhythm = () => {
        // Définir les instruments
        const bassDrum = new Tone.MembraneSynth().toDestination();
        const snareDrum = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 }
        }).toDestination();
        const hiHat = new Tone.MetalSynth({
            frequency: 2000,
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0.1,
                release: 0.1
            }
        }).toDestination();
        const melodySynth = new Tone.Synth().toDestination(); // Synthétiseur pour la mélodie
    
        // Séquence de batterie Disco
        const discoBeat = new Tone.Sequence((time, step) => {
            // Jouer la grosse caisse sur les temps forts (0, 4, 8, 12)
            if (step % 4 === 0) {
                bassDrum.triggerAttackRelease("C2", "8n", time);
            }
            // Jouer la caisse claire sur les temps 2 et 6
            if (step % 4 === 2) {
                snareDrum.triggerAttackRelease("8n", time);
            }
            // Motif de cymbale Hi-Hat sur les temps 0, 1, 2
            if (step % 4 === 0 || step % 4 === 1 || step % 4 === 2) {
                hiHat.triggerAttackRelease("8n", time);
            }
        }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "8n");
    
        // Démarrer la séquence et le transport
        discoBeat.start(0);
        Tone.Transport.bpm.value = 120; // Définir les BPM (ajuster si besoin)
        Tone.Transport.start();
    
        return discoBeat; // Retourner la séquence pour l'arrêter plus tard si nécessaire
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
            } else if (note === 'snare') {
                snare.triggerAttackRelease('8n', time);
            } else if (note === 'hihat') {
                hiHat.triggerAttackRelease('16n', time);
            }
        }, ['kick', 'hihat', 'snare', 'hihat'], 'up').start(0);
    
        Tone.Transport.bpm.value = 120; // Vitesse du rythme (BPM)
        Tone.Transport.start();
        setActiveSoundPlayer(pattern); // Pour arrêter plus tard
    };
    
    const stopVoyage = () => {
        if (voyageInterval) {
            clearInterval(voyageInterval);
            setVoyageInterval(null);
        }
        stopActiveSound(); // Arrêter la boucle de percussions ici aussi
    };
    
    const getRhythmForCountry = (countryName) => {
        switch (countryName) {
            case 'France':
                return playFrenchRhythm();
            case 'Germany':
                return playGermanRhythm();
            case 'Spain':
                return playSpanishRhythm();
            // Ajouter plus de pays ici
            default:
                return playDefaultRhythm();
        }
    };
    
    const playFrenchRhythm = () => {
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
            } else if (note === 'snare') {
                snare.triggerAttackRelease('8n', time);
            } else if (note === 'hihat') {
                hiHat.triggerAttackRelease('16n', time);
            }
        }, ['kick', 'hihat', 'snare', 'hihat'], 'up').start(0);
    
        Tone.Transport.bpm.value = 120; // Vitesse du rythme (BPM)
        Tone.Transport.start();
        return pattern;
    };
    
    const playSpanishRhythm = () => {
        const snare = new Tone.NoiseSynth().toDestination();
        const hiHat = new Tone.MetalSynth().toDestination();
        
        const pattern = new Tone.Pattern((time, note) => {
            if (note === 'snare') {
                snare.triggerAttackRelease('8n', time);
            } else if (note === 'hihat') {
                hiHat.triggerAttackRelease('16n', time);
            }
        }, ['snare', 'hihat'], 'up').start(0);
    
        Tone.Transport.bpm.value = 130; // BPM spécifique à l'Espagne
        Tone.Transport.start();
        return pattern;
    };
    
    const playDefaultRhythm = () => {
        const kick = new Tone.MembraneSynth().toDestination();
        const pattern = new Tone.Loop((time) => {
            kick.triggerAttackRelease('C1', '8n', time);
        }, '1n').start(0);
    
        Tone.Transport.bpm.value = 110; // BPM par défaut
        Tone.Transport.start();
        return pattern;
    };
    
    const stopCurrentRhythm = () => {
        if (activeSoundPlayer) {
            activeSoundPlayer.stop();
            activeSoundPlayer.dispose();
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
