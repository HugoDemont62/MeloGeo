'use client';
import "mapbox-gl/dist/mapbox-gl.css";
import * as React from 'react';
import Map, {GeolocateControl, Layer, Marker, NavigationControl, Source} from 'react-map-gl';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../../layers/layer';
import {useCallback, useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import apiManager from "../../services/api-manager";
import {geojson} from '@/geojson/geojson'

export default function MapboxComponent({setClickedElement, setCityName, markers, checked}) {
    const tokenMapbox = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const tokenOWeather = process.env.NEXT_PUBLIC_OWEATHER_TOKEN;
    const mapRef = useRef();
    const [clickedLngLat, setClickedLngLat] = useState(null);

    // Gestion des états des données

    useEffect(() =>  {
        if(clickedLngLat) {
            apiManager.getCityByLngLat(clickedLngLat.lng, clickedLngLat.lat, tokenMapbox)
                .then(data => {
                    const cityName = data.features[0].properties.name;
                    setCityName(cityName)
                    return apiManager.getWeatherByCity(cityName, tokenOWeather);
                })
                .then(weatherData => {
                    console.log(weatherData);
                })
                .catch(err => console.error(err));
        }
    }, [clickedLngLat]);


    // Configuration de la carte
    const DynamicGeocoder = dynamic(() => import('@mapbox/search-js-react').then(mod => mod.Geocoder), {
        ssr: false
    });


    // Gestion des comportements de la carte
    const handleRetrieve = useCallback((retrieve) => {
        if (retrieve && retrieve.geometry) {
            mapRef.current.flyTo({
                center: retrieve.geometry.coordinates,
                essential: true,
                zoom: 14
            });
        }
    }, []);

    const handleClick = useCallback((event) => {
        const features = mapRef.current.queryRenderedFeatures(event.point, {
            layers: ['unclustered-point']
        });
        setClickedElement(features)
        setClickedLngLat(event.lngLat);
    }, []);

    const handleMouseMove = useCallback((event) => {
        const features = mapRef.current.queryRenderedFeatures(event.point, {
            layers: ['unclustered-point']
        });
        if (features.length > 0) {
            mapRef.current.getCanvasContainer().style.cursor = 'pointer'
        } else {
            mapRef.current.getCanvasContainer().style.cursor = 'crosshair'
        }
    })



    return (
        <div style={{cursor:'crosshair'}}>
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: 4.8357,
                    latitude: 45.7640,
                    zoom: 11
                }}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                mapboxAccessToken={tokenMapbox}
                style={{width: '100%', height: '100vh'}}
                // projection='globe'
                mapStyle="mapbox://styles/mapbox/dark-v11"
            >
                <GeolocateControl position="bottom-right"/>
                <NavigationControl position="bottom-right"/>
                {/*<DynamicGeocoder*/}
                {/*    accesstokenMapbox={tokenMapbox}*/}
                {/*    options={{*/}
                {/*        language: 'fr',*/}
                {/*        country: 'FR'*/}
                {/*    }}*/}
                {/*    onRetrieve={handleRetrieve}*/}
                {/*    value="Rechercher un endroit"*/}
                {/*/>*/}
                {clickedLngLat && (
                    <Marker longitude={clickedLngLat.lng} latitude={clickedLngLat.lat}/>
                )}


                <Source id="trees" type="geojson" data={geojson} cluster={true} clusterMaxZoom={14}
                        clusterRadius={50}>
                    <Layer
                        id="trees-layer"
                        type="circle"
                        paint={{
                            'circle-radius': 6,
                            'circle-color': '#B42222'
                        }}
                        {...clusterLayer}
                    />
                    <Layer {...clusterCountLayer} />
                    <Layer {...unclusteredPointLayer} />
                </Source>
            </Map>
        </div>
    );
}
