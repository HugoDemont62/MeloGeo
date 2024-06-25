'use client'
import React, {useEffect, useState} from 'react';
import SelectATreeComponent from "@/components/menu/menu-parts/SelectATreeComponent";

const MenuComponent = ({clickedElement, cityName, mapRef, setSelectedTree}) => {

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
        <>
            {/*<h1>{cityName} </h1>*/}
            {/*<p>Temperature maximale enregistrée : {temperature}</p>*/}
            {/*<p>Temperature du point de chaleur : {temperature}</p>*/}

            <SelectATreeComponent mapRef={mapRef} setSelectedTree={setSelectedTree}/>
        </>
    )

}

export default MenuComponent;