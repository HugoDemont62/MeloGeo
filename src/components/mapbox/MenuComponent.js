'use client'
import React, {useEffect, useState} from 'react';

const MenuComponent = ({clickedElement, cityName, setDraggedElement, mapRef, setMarkers, markers}) => {

    const [temperature, setTemperature] = useState('0');

    useEffect(() => {
        console.log(clickedElement.length);
        if(clickedElement.length > 0) {
            setTemperature(clickedElement[0].properties.temperature)
        }
    }, [clickedElement]);


    const handleDragStart = (event, element) => {
        setDraggedElement(element);
    };

    const handleDragEnd = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        const { lng, lat } = mapRef.current.getMap().unproject({ x: offsetX, y: offsetY });
        console.log(event.nativeEvent)
        const newMarker = { id: markers.length + 1, lngLat: { lng, lat } };
        setMarkers([...markers, newMarker]);

    };

    useEffect(() => {
        console.log(mapRef)
    },[mapRef])

    return (
        <>
            <h1>{cityName} </h1>
            <p>Temperature maximale enregistrée : {temperature}</p>
            <p>Temperature du point de chaleur : {temperature}</p>

            <div
                draggable
                onDragStart={(e) => handleDragStart(e, {type: 'tree', id: 1, name: 'Arbre 1'})}
                onDragEnd={handleDragEnd}
            >
                Arbre 1
            </div>

        </>
    )

}

export default MenuComponent;