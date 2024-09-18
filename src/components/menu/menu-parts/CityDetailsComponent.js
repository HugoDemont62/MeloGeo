import '../../../app/styles/menu-city.css';
import { useEffect, useState, useRef } from "react";
import TemperatureBar from "@/components/temperature-bar/TemperatureBar";
import * as Tone from 'tone';
import apiManager from "@/services/api-manager"; // Import Tone.js

export default function CityDetailsComponent({ cityName, weatherData, airPollution }) {

    const tokenPexels = process.env.NEXT_PUBLIC_PEXELS_TOKEN;
    // States for weather and air quality
    const [currentTemp, setCurrentTemp] = useState(0);
    const [maxTemp, setMaxTemp] = useState(0);
    const [minTemp, setMinTemp] = useState(0);
    const [humidityLevel, setHumidityLevel] = useState(0);
    const [feltTemp, setFeltTemp] = useState(0);
    const [weatherType, setWeatherType] = useState([]);
    const [backgroundClass, setBackgroundClass] = useState('');
    const [backgroundVideo, setBackgroundVideo] = useState('');
    

    // Air quality state
    const [jauge, setJauge] = useState('');
    const [etatAir, setEtatAir] = useState('');


    // Ref to track the noise generator
    const noise = useRef(new Tone.Noise('brown').toDestination()).current;

    useEffect(() => {
        // Initialize the Tone.js context
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
    }, []);

    const fetchAndSetBackgroundVideo = (query, token) => {
        apiManager.getPexelsVideos(query, token).then(data => {
            if (data.videos.length && data.videos[0]['video_files'].length) {
                console.log(data.videos);
                const videos = data.videos;
                setBackgroundVideo(videos[0]['video_files'][0].link);
            } else {
                setBackgroundVideo('');
            }
        }).catch(error => {
            console.error(`Erreur lors de la récupération des vidéos pour ${query} : `, error);
            setBackgroundVideo('');
        });
    };



    useEffect(() => {
        if (weatherData.main) {
            const { temp, temp_max, temp_min, humidity, feels_like } = weatherData.main;
            const { weather } = weatherData;

            // Conversion des températures de Kelvin à Celsius
            setCurrentTemp(temp);
            setMaxTemp(temp_max);
            setMinTemp(temp_min);
            setHumidityLevel(humidity);
            setFeltTemp(feels_like);
            setWeatherType(weather);

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

    useEffect(() => {
        console.log(backgroundVideo)
    }, [backgroundVideo]);

    return (
        <div className={`container ${backgroundClass}`}>
            {backgroundVideo && (
                <video
                    autoPlay
                    loop
                    muted
                    className="background-video"
                    src={backgroundVideo}
                />
            )}
            <h2 className='item'>{cityName}</h2>
            <span className='item'>Actuellement sur la ville :</span>
            <div className="datas-container">
                <div className='item'>
                    <p><strong>Aujourd'hui</strong></p>
                    <div className='current-temperatures'>
                        <div>
                            <img src='/images/map-menu/rain.png' alt="icone humidité"/>
                            <p>{humidityLevel}%</p>
                        </div>
                        <div>
                            <img src='/images/map-menu/temp-max.png' alt="icone temperature maximun"/>
                            <p>{maxTemp}°</p>
                        </div>
                        <div>
                            <img src='/images/map-menu/temp-min.png' alt="icone temperature minimum"/>
                            <p>{minTemp}°</p>
                        </div>
                        <div style={{gap: 8, fontWeight: 'lighter', fontSize: 13}}>
                            <p>Ressentie</p>
                            <p>{feltTemp}°</p>
                        </div>
                    </div>
                    <div style={{width: 350}}>
                        <TemperatureBar value={currentTemp}/>
                    </div>
                </div>
                <div className="item temp">
                    <p>Maximum atteint</p><br/>
                    <p className='indicator'>38°</p>
                </div>
            </div>

            <div className="datas-container">
                <div className="air item">
                    <p><strong>Qualité de l'air</strong></p>
                    <img src={jauge} alt="jauge qualite air"/>
                    <p>{etatAir}</p>
                </div>
            </div>

            {/*{isRainWeather && (*/}
            {/*    <button onClick={toggleRainSound}>*/}
            {/*        {isRainSoundPlaying ? 'Stop Rain Sound' : 'Play Rain Sound'}*/}
            {/*    </button>*/}
            {/*)}*/}
        </div>
    );
}
