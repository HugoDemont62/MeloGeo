'use client'
import React, {useEffect, useState} from 'react';
import SelectATreeComponent from "@/components/menu/menu-parts/SelectATreeComponent";

const MenuComponent = ({clickedElement, cityName, mapRef, setSelectedTree, selectedTree}) => {

    const [temperature, setTemperature] = useState('0');

    useEffect(() => {
        console.log(clickedElement.length);
        if(clickedElement.length > 0) {
            setTemperature(clickedElement[0].properties.temperature)
        }
    }, [clickedElement]);


    useEffect(() => {
        console.log(mapRef)
    },[mapRef])

    return (
        <div style={{height:'100vh', backgroundColor:'white', padding: 20, borderRadius: 10, overflowY:"scroll"}}>
            <SelectATreeComponent mapRef={mapRef} setSelectedTree={setSelectedTree} selectedTree={selectedTree}/>
        </div>
    )

}

export default MenuComponent;