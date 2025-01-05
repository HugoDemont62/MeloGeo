import "mapbox-gl/dist/mapbox-gl.css";
import * as React from 'react';

import Map, {GeolocateControl, Marker, NavigationControl} from 'react-map-gl';
import {useCallback, useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import apiManager from "../../services/api-manager";
import * as Tone from 'tone';
import WaveBarComponent from '@/components/wave-bar/WaveBarComponent';
import Slide from "@mui/material/Slide";
import MaintenanceBanner from "@/app/MaintenanceBanner";

export default function MapboxComponent({
                                            setClickedElement,
                                            weatherData,
                                            setMenuCity,
                                            setCityName,
                                            setWeatherData,
                                            setAirPollution,
                                            setMapRef,
                                            selectedTree,
                                            setMarkers,
                                            markers
                                        }) {

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
    const [airQualityIndex, setAirQualityIndex] = useState(null); // Par défaut null
    const [longitude, setLongitude] = useState(null); // Par défaut null
    const [latitude, setLatitude] = useState(null); // Par défaut null
    const [isVoyageStarted, setIsVoyageStarted] = useState(false);
    let isVoyageStartedRef = useRef(isVoyageStarted);
    const cities = [
        {name: "Paris", region: "Île-de-France"},
        {name: "Marseille", region: "Provence-Alpes-Côte d'Azur"},
        {name: "Lyon", region: "Auvergne-Rhône-Alpes"},
        {name: "Toulouse", region: "Occitanie"},
        {name: "Nice", region: "Provence-Alpes-Côte d'Azur"},
        {name: "Nantes", region: "Pays de la Loire"},
        {name: "Montpellier", region: "Occitanie"},
        {name: "Strasbourg", region: "Grand Est"},
        {name: "Bordeaux", region: "Nouvelle-Aquitaine"},
        {name: "Lille", region: "Hauts-de-France"},
        {name: "Rennes", region: "Bretagne"},
        {name: "Reims", region: "Grand Est"},
        {name: "Saint-Étienne", region: "Auvergne-Rhône-Alpes"},
        {name: "Le Havre", region: "Normandie"},
        {name: "Toulon", region: "Provence-Alpes-Côte d'Azur"},
        {name: "Grenoble", region: "Auvergne-Rhône-Alpes"},
        {name: "Dijon", region: "Bourgogne-Franche-Comté"},
        {name: "Angers", region: "Pays de la Loire"},
        {name: "Nîmes", region: "Occitanie"},
        {name: "Aix-en-Provence", region: "Provence-Alpes-Côte d'Azur"}
    ];
    const noteImages = [
        './images/icons-music/note1.png',
        './images/icons-music/note2.png',
        './images/icons-music/note3.png'
    ];

    // Fonction pour supprimer ou réinitialiser markersList
    const clearMarkersList = () => {
        setMarkersList([]);
    };

    const getWeatherByCities = () => {
        cities.forEach((city) => {
            apiManager.getWeatherByCity(city.name, tokenOWeather).then(data => {
                setMarkersWeather(prevMarkersWeather => [...prevMarkersWeather, data]);
            });
        });
    };

    useEffect(() => {
        if (clickedLngLat) {
            // Met à jour longitude et latitude
            setLongitude(clickedLngLat.lng);
            setLatitude(clickedLngLat.lat);

            // Récupérez la qualité de l'air via l'API
            apiManager
            .getAirPollution(clickedLngLat.lng, clickedLngLat.lat, tokenOWeather)
            .then((data) => {
                if (data && data.list && data.list.length > 0) {
                    // Mise à jour de l'état avec l'AQI récupéré
                    setAirQualityIndex(data.list[0].main.aqi);
                } else {
                    console.log("Impossible de récupérer la qualité de l'air");
                }
            })
            .catch((err) =>
              console.log("Erreur lors de la récupération de l'Air Quality Index :", err)
            );
        }
    }, [clickedLngLat, tokenOWeather]);

    useEffect(() => {
        getWeatherByCities();
    }, []);

    useEffect(() => {
        if (weatherData) {
            playSoundForWeather(weatherData.weather[0].main, airQualityIndex, longitude, latitude);
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
            image: noteImages[Math.floor(Math.random() * noteImages.length)] // Choisir une image au hasard
        };
        setMarkers(prevMarkers => [...prevMarkers, newMarker]);
        setMarkersList(prevMarkersList => [...prevMarkersList, newMarker]);
    }, [selectedTree]);

    const playSoundForWeather = (weatherType, airQualityIndex, longitude, latitude) => {
        stopAmbiancePlayer();

        let baseFrequency = 440;
        let effectIntensity = 0;
        let synth;

        if (longitude !== null && latitude !== null) {
            longitude = Math.abs(longitude);
            latitude = Math.abs(latitude);
            baseFrequency = 200 + Math.abs(longitude - latitude) * 10;
            effectIntensity = Math.abs(longitude * latitude) % 1;
        }

        switch (weatherType) {
            case "Clear":
                synth = new Tone.Synth({
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.02 + effectIntensity * (longitude % 1), decay: 0.01 + effectIntensity * (latitude / 100) , release: 0.1 },
                    harmonicity: Math.max(0, 4 + effectIntensity * longitude),

                }).toDestination();
                synth.triggerAttackRelease("C4", "2n");
                setSynth(synth);

                break;

            case "Rain":
                synth = new Tone.MembraneSynth({
                    pitchDecay: 0.05 + effectIntensity / 4,
                    octaves: 1 + effectIntensity,
                    envelope: {
                        attack: 0.01,
                        sustain: effectIntensity / 2,
                        decay: 0.2,
                        release: 0.1,
                    },
                    harmonicity: Math.max(0, 2 + effectIntensity * longitude),
                }).toDestination();

                const rainDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
                synth.connect(rainDelay);
                synth.triggerAttackRelease("D3", "8n");
                setSynth(synth);
                break;

            case "Clouds":
                synth = new Tone.FMSynth({
                    harmonicity: Math.max(0, 2 + effectIntensity * longitude),
                    modulationIndex: Math.max(0, longitude + effectIntensity * longitude),
                    envelope: {
                        attack: 0.01 + effectIntensity * (longitude % 1),
                        decay: 0.02 + effectIntensity * (longitude / 100),
                        sustain: 0.04,
                        release: 1 + effectIntensity * (longitude / 10),
                    },
                    modulationEnvelope: {
                        attack: 0.03 + effectIntensity * 0.1,
                        decay: 0.02,
                        sustain: 0.03,
                        release: 0.4,
                    },
                }).toDestination();
                synth.triggerAttackRelease("A3", "8n");
                setSynth(synth);
                break;

            case "Snow":
                synth = new Tone.Synth({
                    oscillator: { type: "triangle" },
                    envelope: {
                        attack: 0.05 + effectIntensity * (longitude % 1),
                        decay: 0.03 + effectIntensity * (longitude / 100),
                        sustain: effectIntensity * 0.09,
                        release: 0.05 + effectIntensity * (longitude / 10),
                    },
                    harmonicity: Math.max(0, 0.2 + effectIntensity * longitude),
                }).toDestination();
                synth.triggerAttackRelease("E5", "4n");
                setSynth(synth);
                break;

            case "Thunderstorm":
                const thunderNoise = new Tone.Noise("brown").start();
                const thunderFilter = new Tone.Filter(150 + effectIntensity * 50, "lowpass").toDestination();
                const thunderDistortion = new Tone.Distortion(effectIntensity * 2).toDestination();

                thunderNoise.connect(thunderFilter);
                thunderFilter.connect(thunderDistortion);
                thunderNoise.stop("+1.5");
                setSynth(thunderNoise);
                break;

            case "Drizzle":
                synth = new Tone.NoiseSynth({
                    noise: { type: "white" },
                    envelope: { attack: 0.02, decay: 0.01, sustain: 0.01 },
                    harmonicity: Math.max(0, 2 + effectIntensity * longitude),
                }).toDestination();
                synth.triggerAttackRelease("4n");
                break;

            case "Wind":
                synth = new Tone.AMSynth({
                    oscillator: { type: "square" },
                    harmonicity: Math.max(0, 1.5 + effectIntensity * longitude),
                    envelope: {
                        attack: 0.02,
                        decay: 0.05,
                        sustain: 0.03,
                        release: effectIntensity,
                    },
                }).toDestination();
                synth.triggerAttackRelease(`${baseFrequency + 150}Hz`, "2n");
                break;

            default:
                synth = new Tone.Synth().toDestination();
                synth.triggerAttackRelease(`${baseFrequency}Hz`, "8n");
                break;
        }

        const reverb = new Tone.Reverb({
            decay: 2 + effectIntensity * 5,
            wet: 0.3 + effectIntensity / 2,
        }).toDestination();

        const delay = new Tone.FeedbackDelay("16n", 0.2).toDestination();
        synth.connect(reverb);
        synth.connect(delay);

        setSynth(synth);
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
        setMenuCity(false)
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
                    stopVoyage();  // Arrêter la boucle de percussions
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
                            playSoundForWeather(weatherData.weather[0].main, airQualityIndex, longitude, latitude);                        
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
            envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
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

        // Liste des patterns possibles (varie selon les voyages)
        const patterns = [
            ['kick', 'hihat', 'snare', 'hihat'],
            ['kick', 'kick', 'snare', 'hihat'],
            ['hihat', 'snare', 'kick', 'snare'],
            ['kick', 'hihat', 'kick', 'snare', 'hihat'],
        ];

        // Sélectionner aléatoirement un pattern
        const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

        // Ajouter des variations sur les BPM (entre 90 et 150)
        const randomBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
        Tone.Transport.bpm.value = randomBPM;

        // Initialiser un pattern dynamique
        const pattern = new Tone.Pattern((time, note) => {
            if (note === 'kick') {
                // Jouer des notes aléatoires pour le kick
                const randomNote = ['C2', 'D2', 'E2'][Math.floor(Math.random() * 3)];
                kick.triggerAttackRelease(randomNote, '8n', time);
                setSynth(kick);
            } else if (note === 'snare') {
                snare.triggerAttackRelease('8n', time);
                setSynth(snare);
            } else if (note === 'hihat') {
                hiHat.triggerAttackRelease('16n', time);
                setSynth(hiHat);
            }
        }, randomPattern, 'up').start(0);

        // Démarrer le transport pour chaque voyage
        Tone.Transport.start();

        // Garder la référence du player
        setVoyagePlayer(pattern);
    };

    const stopVoyage = () => {
        stopVoyagePlayer();

        if (Tone.Transport.state === "started") {
            Tone.Transport.stop(); // Arrête le transport de Tone.js
        }
        setVoyageInterval(null);
        setIsVoyageStarted(false);
        isVoyageStartedRef.current = false;

    };


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

    
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      // Détecte la largeur d'écran au chargement
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      handleResize(); // Vérifie une première fois
  
      // Ajoute un listener pour gérer les changements de taille de l'écran
      window.addEventListener('resize', handleResize);
  
      return () => {
        // Nettoyage du listener
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    const stylesTravel = isMobile
      ? { display: 'none' } // Style pour mobile
      : { // Style pour desktop
          position: 'absolute',
          top: 10,
          left: 100,
          zIndex: 1,
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        };
    

    return (
        <div style={{cursor: 'crosshair'}}>
            <MaintenanceBanner />  
            <div style={{position: 'relative', height: '100vh'}}>
                <div className="travel-element" style={stylesTravel}>
                    <div>
                        <button className="button-icon" onClick={startVoyage}><img height={24}
                                                                                   src="./images/weather-markers/play.png"
                                                                                   title="play icons"/></button>
                    </div>
                    <hr/>
                    <Slide in={isVoyageStartedRef.current} direction="right" mountOnEnter unmountOnExit>
                        <div>
                            <button className="button-icon" onClick={stopVoyage}><img height={28}
                                                                                      src="./images/weather-markers/pause-button.png"/>
                            </button>
                        </div>
                    </Slide>
                    <button className="button-icon" onClick={clearMarkersList}><img height={28}
                                                            src="./images/weather-markers/location.png"/></button>
                    <input type="range" min="20" max="1000" step="1"
                           value={Tone.Transport?.bpm?.value || 120}  // Valeur par défaut si undefined
                           onChange={(e) => {
                               if (Tone.Transport?.bpm) {
                                   Tone.Transport.bpm.value = e.target.value;
                               }
                           }}/>


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
                    style={{width: '100%', height: '100%'}}
                    mapStyle="mapbox://styles/mapbox/navigation-day-v1"
                >
                    <GeolocateControl position="bottom-left"/>
                    <NavigationControl position="bottom-left"/>
                    {markersList.map(marker => (
                        <Marker
                            key={marker.id}
                            longitude={marker.longitude}
                            latitude={marker.latitude}
                            anchor="bottom">

                            <img
                                src={marker.image}
                                alt="weather icon"
                                style={{width: '24px', height: '24px'}}
                            />

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
                                style={{width: '34px', height: '34px'}}
                            />
                        </Marker>
                    ))}

                    <WaveBarComponent synth={synth}/>

                </Map>
            </div>
        </div>
    );
}
