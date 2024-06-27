'use client'
import React, {useEffect, useState} from 'react';
import SelectATreeComponent from "@/components/menu/menu-parts/SelectATreeComponent";
import CircularWithValueLabel from "@/components/circularprogressbar/CircularProgress";

const MenuComponent = ({clickedElement, cityName, mapRef, setSelectedTree, selectedTree, treesNeeded, markers, heatPointId}) => {

    const [temperature, setTemperature] = useState('0');

    useEffect(() => {
        if(clickedElement.length > 0) {
            setTemperature(clickedElement[0].properties.temperature)
        }
    }, [clickedElement]);


    return (
        <div style={{height:'100vh', backgroundColor:'white', padding: 20, borderRadius: 10, overflowY:"scroll"}}>
            <div style={{marginBottom:24, display:"flex", alignItems:'center', justifyContent:'center', gap:20}}>
                <div>
                    <p style={{fontSize:20}}><strong>Zone sélectionneée</strong></p>
                    <p style={{fontSize:16}}>À toi de jouer !</p>
                </div>
                <div>
                    <p style={{fontSize: 20}}><strong>Félicitations !</strong></p>
                    <p style={{fontSize: 16}}>Grâce à toi, cette zone est désormais plus confortable à vivre.</p>
                </div>
                <CircularWithValueLabel treesNeeded={treesNeeded} markers={markers} heatPointId={heatPointId}/>
            </div>
            <div>
                <p style={{fontSize:13, marginBottom:22}}>Voici une sélection des différentes espèces d’arbre adaptées au climat locale et qui auront le plus d’impact sur la chaleur des ville à l’âge de maturité :  </p>
            </div>
            <SelectATreeComponent mapRef={mapRef} setSelectedTree={setSelectedTree} selectedTree={selectedTree}/>
        </div>
    )

}

export default MenuComponent;