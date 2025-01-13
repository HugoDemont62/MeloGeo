import '../../../app/styles/menu-city.css';
import { useEffect, useState } from "react";
import TemperatureBar from "@/components/temperature-bar/TemperatureBar";
import * as Tone from 'tone';
import apiManager from "@/services/api-manager";
import * as React from "react";
import { GaugeComponent } from "react-gauge-component";
import AirQualityGauge from "@/components/gauge/AirQualityGauge";

export default function CityDetailsComponent({ cityName, weatherData, airPollution}) {
    const tokenOWeather = process.env.NEXT_PUBLIC_OWEATHER_TOKEN;
    const tokenPexels = process.env.NEXT_PUBLIC_PEXELS_TOKEN;
    const tokenGIPHY = process.env.NEXT_PUBLIC_GHIFY_TOKEN;

    // States for weather and air quality
    const [currentTemp, setCurrentTemp] = useState(0);
    const [maxTemp, setMaxTemp] = useState(0);
    const [minTemp, setMinTemp] = useState(0);
    const [humidityLevel, setHumidityLevel] = useState(0);
    const [feltTemp, setFeltTemp] = useState(0);
    const [weatherType, setWeatherType] = useState([]);
    const [backgroundClass, setBackgroundClass] = useState('');
    const [backgroundVideo, setBackgroundVideo] = useState('');
    const [backgroundGif, setBackgroundGif] = useState('');
    const [currentWeatherIcon, setCurrentWeatherIcon] = useState('');
    const [dailyForecasts, setDailyForecasts] = useState([]);

    // Air quality state
    const [jauge, setJauge] = useState('');
    const [etatAir, setEtatAir] = useState('');

    useEffect(() => {
        // Initialize the Tone.js context
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
    }, []);

    useEffect(() => {
        apiManager.get5DayForecast(cityName, tokenOWeather).then(data => {
            const dailyData = processDailyForecasts(data.list);
            setDailyForecasts(dailyData);
        }).catch(error => {
            console.error('Erreur lors de la récupération des prévisions :', error);
        });
    }, [cityName]);

    const fetchAndSetGif = (query, token) => {
        apiManager.getGiphyGif(query, token).then(data => {
            if (data.data.length) {
                setBackgroundVideo('');
                setBackgroundGif(data.data[0].images.original.url);
            } else {
                setBackgroundVideo('');
            }
        }).catch(error => {
            console.error(`Erreur lors de la récupération des GIFs pour ${query} : `, error);
            setBackgroundVideo('');
        });
    };

    const fetchAndSetBackgroundVideo = (query, token) => {
        apiManager.getPexelsVideos(query, token).then(data => {
            if (data.videos.length && data.videos[0]['video_files'].length) {
                const videos = data.videos;
                setBackgroundVideo(videos[0]['video_files'][0].link);
            } else {
                // Si aucune vidéo n'a été trouvée, tente de récupérer un GIF
                fetchAndSetGif(query, tokenGIPHY);
            }
        }).catch(error => {
            console.error(`Erreur lors de la récupération des vidéos pour ${query} : `, error);
            // En cas d'erreur, tente de récupérer un GIF
            fetchAndSetGif(query, tokenGIPHY);
        });
    };

    useEffect(() => {
        if (weatherData.main) {
            const { temp, temp_max, temp_min, humidity, feels_like } = weatherData.main;
            const { weather } = weatherData;

            // Conversion des températures de Kelvin à Celsius
            setCurrentTemp(Math.round(temp));
            setMaxTemp(Math.round(temp_max));
            setMinTemp(Math.round(temp_min));
            setHumidityLevel(Math.round(humidity));
            setFeltTemp(Math.round(feels_like));
            setWeatherType(weather);
            setCurrentWeatherIcon(`https://openweathermap.org/img/wn/${weather[0].icon}.png`);

            switch (weather[0].main) {
                case 'Rain':
                    setBackgroundClass('rainy-background');
                    fetchAndSetBackgroundVideo('rain', tokenPexels);
                    break;
                case 'Clouds':
                    setBackgroundClass('cloudy-background');
                    fetchAndSetBackgroundVideo('cloud sky', tokenPexels);
                    break;
                case 'Clear':
                    setBackgroundClass('sunny-background');
                    fetchAndSetBackgroundVideo('blue sky', tokenPexels);
                    break;
                case 'Drizzle':
                    setBackgroundClass('drizzly-background');
                    fetchAndSetBackgroundVideo('rain', tokenPexels);
                    break;
                case 'Thunderstorm':
                    setBackgroundClass('thunderstorm-background');
                    fetchAndSetBackgroundVideo('orages', tokenPexels);
                    break;
                case 'Snow':
                    setBackgroundClass('snowy-background');
                    fetchAndSetBackgroundVideo('snow', tokenPexels);
                    break;
                case 'Atmosphere':
                    setBackgroundClass('atmospheric-background');
                    fetchAndSetBackgroundVideo('fog', tokenPexels);
                    break;
                case 'Mist':
                    fetchAndSetBackgroundVideo('mist', tokenPexels);
                    break;
                default:
                    setBackgroundClass('');
                    setBackgroundVideo('');
                    break;
            }
        }
    }, [weatherData]);

    useEffect(() => {
        if (airPollution.list) {
            if (airPollution.list[0].main.aqi === 1 || airPollution.list[0].main.aqi === 2) {
                setJauge('/images/map-menu/low.png');
                setEtatAir('Bon');
            }

            if (airPollution.list[0].main.aqi === 3) {
                setJauge('/images/map-menu/medium.png');
                setEtatAir('Moyen');
            }

            if (airPollution.list[0].main.aqi >= 4) {
                setJauge('/images/map-menu/hight.png');
                setEtatAir('Mauvais');
            }
        }
    }, [airPollution]);

    const processDailyForecasts = (hourlyForecasts) => {
        const dailyMap = {};

        hourlyForecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
            if (!dailyMap[date]) {
                dailyMap[date] = {
                    date,
                    temp: Math.round(forecast.main.temp),
                    icon: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`,
                    humidity: forecast.main.humidity,
                    windSpeed: forecast.wind.speed,
                };
            }
        });

        return Object.values(dailyMap);
    };

    return (
        <div className={`city-details-container ${backgroundClass}`}>
            {backgroundVideo && (
                <video
                    autoPlay
                    loop
                    muted
                    className="background-video"
                    src={backgroundVideo}
                />
            )}
            {!backgroundVideo && backgroundGif && (
                <img
                    className="background-video"
                    src={backgroundGif}
                    alt="Background GIF"
                />
            )}
            <div className="city-details-content">
                <h2 className="city-name">{cityName}</h2>
                <p className="subtitle">Actuellement sur la ville</p>

                <div className="current-weather">
                    <div className="temperature-section">
                        <p className="temperature">{currentTemp}°C</p>
                        <img
                            src={currentWeatherIcon}
                            alt="Weather Icon"
                            className="weather-icon"
                        />
                    </div>
                    <div className="temperature-details">
                        <div>
                            <img src="/images/map-menu/rain.png" alt="Humidité" />
                            <p>{humidityLevel}% Humidité</p>
                        </div>
                        <div>
                            <img src="/images/map-menu/temp-max.png" alt="Max Temp" />
                            <p>{maxTemp}° Max</p>
                        </div>
                        <div>
                            <img src="/images/map-menu/temp-min.png" alt="Min Temp" />
                            <p>{minTemp}° Min</p>
                        </div>
                        <div>
                            <p>Ressentie</p>
                            <p>{feltTemp}°</p>
                        </div>
                    </div>
                </div>

                <div className="forecast-section">
                    <h3>Prévisions à venir</h3>
                    <div className="forecast-list">
                        {dailyForecasts.length > 0 ? (
                            dailyForecasts.map((forecast, index) => (
                                <div className="forecast-item" key={index}>
                                    <p>{new Date(forecast.date).toLocaleDateString()}</p>
                                    <img src={forecast.icon} alt="Forecast Icon" />
                                    <p>{forecast.temp}°C</p>
                                </div>
                            ))
                        ) : (
                            <p>Aucune prévision disponible.</p>
                        )}
                    </div>
                </div>

                <div className="air-quality">
                    <AirQualityGauge airPollution={airPollution} />
                </div>
            </div>
        </div>
    );
}