import '../../../app/styles/menu-city.css';
import {useEffect, useState} from "react";
import TemperatureBar from "@/components/temperature-bar/TemperatureBar";

export default function CityDetailsComponent({cityName, weatherData, airPollution}) {

    // Gestion des états des données du climat
    const [currentTemp, setCurrentTemp] = useState(0);
    const [maxTemp, setMaxTemp] = useState(0);
    const [minTemp, setMinTemp] = useState(0);
    const [humidityLevel, setHumidityLevel] = useState(0);
    const [feltTemp, setFeltTemp] = useState(0);
    const [weatherType, setWeatherType] = useState([]);
    const [backgroundClass, setBackgroundClass] = useState('');
    

    // Jauge qualité de l'air
    const [jauge, setJauge] = useState('');
    const [etatAir, setEtatAir] = useState('');

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

            // Met à jour le background selon la météo principale
            switch (weather[0].main) {
                case 'Rain':
                    setBackgroundClass('rainy-background');
                    break;
                case 'Clouds':
                    setBackgroundClass('cloudy-background');
                    break;
                case 'Clear':
                    setBackgroundClass('sunny-background');
                    break;
                default:
                    setBackgroundClass('');
                    break;
            }
        }
    }, [weatherData]);

    useEffect(() => {
        if(airPollution.list){
            if(airPollution.list[0].main.aqi === 1 || airPollution.list[0].main.aqi === 2 ) {
                setJauge('/images/map-menu/low.png');
                setEtatAir('Bon');
            }

            if(airPollution.list[0].main.aqi === 3) {
                setJauge('/images/map-menu/medium.png');
                setEtatAir('Moyen');
            }

            if(airPollution.list[0].main.aqi >= 4) {
                setJauge('/images/map-menu/hight.png');
                setEtatAir('Mauvais');
            }
        }
    }, [airPollution]);

    return (
        <>
            <div className={`container ${backgroundClass}`}>
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
                                <p>  {feltTemp}°</p>
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
                    <div className="air item ">
                        <p><strong>Qualité de l'air</strong></p>
                        <img src={jauge} alt="jauge qualite air"/>
                        <p>{etatAir}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
