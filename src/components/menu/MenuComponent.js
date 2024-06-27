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
            <div style={{marginBottom:24}}>
            <CircularWithValueLabel treesNeeded={treesNeeded} markers={markers} heatPointId={heatPointId}/>
            </div>
            <SelectATreeComponent mapRef={mapRef} setSelectedTree={setSelectedTree} selectedTree={selectedTree}/>
        </div>
    )

}

export default MenuComponent;