'use client'
import '../../../app/styles/menu-city.css';
import {useEffect, useState} from "react";
export default function CityDetailsComponent({cityName, weatherData, airPollution}) {

    // Gestion des états des données du climat
    const [currentTemp, setCurrentTemp] = useState(0)
    const [maxTemp, setMaxTemp] = useState(0)
    const [minTemp, setMinTemp] = useState(0)
    const [humidityLevel, setHumidityLevel] = useState(0)
    const [feltTemp, setFeltTemp] = useState(0)
    // Jauge qualité de l'air
    const [jauge, setJauge] = useState('')
    const [etatAir, setEtatAir] = useState('')

    useEffect(() => {
        if (weatherData.main) {
            const { temp, temp_max, temp_min, humidity, feels_like  } = weatherData.main;
            // Conversion des températures de Kelvin à Celsius
            setCurrentTemp(temp);
            setMaxTemp(temp_max);
            setMinTemp(temp_min);
            setHumidityLevel(humidity);
            setFeltTemp(feels_like)
        }
    }, [weatherData]);

    useEffect(() => {
       if(airPollution.list[0].main.aqi === 1 || airPollution.list[0].main.aqi === 2 ) {
           setJauge('/images/map-menu/low.png')
           setEtatAir('Bon')
       }

        if(airPollution.list[0].main.aqi === 3) {
            setJauge('/images/map-menu/medium.png')
            setEtatAir('Moyen')
        }

        if(airPollution.list[0].main.aqi >= 4) {
            setJauge('/images/map-menu/hight.png')
            setEtatAir('Mauvais')
        }

    }, [airPollution]);



    return (
        <>
            <div className="container">
                <h2>{cityName}</h2>
                <h3>Les ilots de chaleurs</h3>
                <p>Regarde l’impact en direct sur la carte, cela correspond à des zones de fortes chaleur en été et
                    si on ne fait rien ça ne cessera pas d’augmenter !</p>
                <span>Actuellement sur la ville :</span>
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


                    </div>
                    <div className="item temp">
                        <p>Maximum atteint</p><br/>
                        <p className='indicator'>38°</p>
                    </div>
                </div>

                <div className="datas-container">
                    <div className="item">
                        <div style={{
                            textAlign: 'left'
                        }}>
                            <div>
                                <p><strong>Couverture arboricole</strong></p>
                                <p>du territoire en arbre</p>
                            </div>
                            <div style={{display:"flex", alignItems:"center", justifyContent:'center'}}><img className='img-tree' src='/images/map-menu/tree.png' alt='tree'/>
                                <p className="indicator">10%</p></div>
                        </div>
                    </div>
                    <div className="air item ">
                        <p><strong>Qualité de l'air</strong></p>
                        <img src={jauge} alt="jauge qualite air"/>
                    <p>{etatAir}</p>
                </div>
            </div>
                <br/>
                <hr/>
                <br/>
                <h3>L'impact des arbres en ville</h3>
                <p>Malgré les efforts déjà déployés, Il faut continuer à planter des arbres et des végétaux dans les
                    quartiers urbains.</p>
                <span>Où ça ?</span>
                <div className="where-container item">
                    <img src='/images/map-menu/map-icon.png' alt='icone google map'/>
                    <p>Le long des rues et sur les places publiques</p>
                </div>
                <span>Pourquoi ?</span>
                <div className="why-container">
                    <div className="item temp">
                        <img className="why-icon" src="/images/map-menu/jauge-icon.png"
                             alt='jauge temperature icone'/>
                        <p>Améliorer le cadre de vie et offrir de l’ombre aux habitants.</p>
                    </div>
                    <div className="item temp">
                        <img className="why-icon" src="/images/map-menu/fan.png" alt='ventilateur icone'/>
                        <p>Réduire la chaleur urbaine.</p>
                    </div>
                    <div className="item temp">
                        <img className="why-icon" src="/images/map-menu/wind.png" alt='vent icone'/>
                        <p>Améliorer la qualité de l'air et réduire la pollution.</p>
                    </div>
                    <div className="item temp">
                        <img className="why-icon" src="/images/map-menu/world.png" alt='world icone'/>
                        <p>Favoriser de la biodiversité en milieu urbain.</p>
                    </div>
                </div>
            </div>

        </>
    )
}