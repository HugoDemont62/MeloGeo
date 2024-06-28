'use client'
import React, {useEffect, useState} from 'react';
import SelectATreeComponent from "@/components/menu/menu-parts/SelectATreeComponent";
import CircularWithValueLabel from "@/components/circularprogressbar/CircularProgress";
import Fade from '@mui/material/Fade';
import Collapse from "@mui/material/Collapse";

const MenuComponent = ({clickedElement, cityName, mapRef, setSelectedTree, selectedTree, treesNeeded, markers, heatPointId, setIsCured, isCured}) => {

    const [temperature, setTemperature] = useState('0');

    useEffect(() => {
        if(clickedElement.length > 0) {
            setTemperature(clickedElement[0].properties.temperature)
        }
    }, [clickedElement]);


    return (
        <div style={{height:'95vh', backgroundColor:'white', padding: 20, borderRadius: 10, overflowY:"scroll"}}>
            <div style={{marginBottom:24, display:"flex", alignItems:'center', justifyContent:'center', gap:20}}>
                <div style={{width:200}}>
                <Collapse in={!isCured}>
                    <div>
                        <p style={{fontSize:20}}><strong>Zone sélectionnée</strong></p>
                        <p style={{fontSize:16}}>À toi de jouer !</p>
                    </div>
                </Collapse>
                <Collapse in={isCured}>
                    <div style={{width:200}}>
                        <p style={{fontSize: 20}}><strong>Félicitations ! :)</strong></p>
                        <p style={{fontSize: 16}}>Grâce à toi, cette zone est désormais plus confortable à vivre.</p>
                    </div>
                </Collapse>
                    </div>
                <CircularWithValueLabel treesNeeded={treesNeeded} markers={markers} heatPointId={heatPointId} setIsCured={setIsCured}/>
            </div>
            <div>
                <p style={{fontSize:13, marginBottom:22}}>Voici une sélection des différentes espèces d’arbre adaptées au climat locale et qui auront le plus d’impact sur la chaleur des ville à l’âge de maturité :  </p>
            </div>
            <SelectATreeComponent mapRef={mapRef} setSelectedTree={setSelectedTree} selectedTree={selectedTree}/>
        </div>
    )

}

export default MenuComponent;