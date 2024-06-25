'use client'
import '../../../app/styles/menu-city.css';
export default function CityDetailsComponent({cityName}) {


    return (
        <>
            <div className="container">
                <h2>{cityName}</h2>
                <h3>Les ilots de chaleurs</h3>
                <p>Regarde l’impact en direct sur la carte, cela correspond à des zones de fortes chaleur en été et
                    si on ne fait rien ça ne cessera pas d’augmenter !</p>
                <span>Actuellement sur la ville :</span>
                <div className="datas-container">
                    <div className="item temp">
                        <p>Température max atteinte en été</p><br/>
                        <p className='indicator'>38°</p>
                    </div>
                    <div className="item" style={{display: "flex"}}>
                        <div><img className='img-tree' src='/images/map-menu/tree.png' alt='tree'/></div>
                        <div style={{
                            textAlign: 'left',
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <p><strong>Couverture arboricole</strong></p>
                                <p>du territoire en arbre</p>
                            </div>
                            <p className="indicator">10%</p>
                        </div>
                    </div>
                </div>
                <div className="air item ">
                    <p><strong>Qualité de l'air</strong></p>
                    <img src="/images/map-menu/jauge.png" alt="jauge qualite air"/>
                    <p>Moyen</p>
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