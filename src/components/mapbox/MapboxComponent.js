'use client';
import "mapbox-gl/dist/mapbox-gl.css";
import * as React from 'react';
import Map, {GeolocateControl, Layer, Marker, NavigationControl, Source} from 'react-map-gl';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from '../../layers/layer';
import {useCallback, useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import apiManager from "../../services/api-manager";
import {geojson} from '@/geojson/geojson'



export default function MapboxComponent() {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    // Gestion des états des données
    const [clickedPosition, setClickedPosition] = useState(null);
    const [featurePoint, setFeaturePoint] = useState(null);
    // const [clickedPositionInfos, setClickedPositionInfos] = useState(null);

    // useEffect(() => {
    //     if(clickedPosition) {
    //         setClickedPositionInfos(apiManager.getPositionClickedInfos(clickedPosition.lng, clickedPosition.lat, token));
    //     }
    // }, [clickedPosition]);

    useEffect(() => {
    console.log(featurePoint)
    },[featurePoint])


    // Configuration de la carte
    const DynamicGeocoder = dynamic(() => import('@mapbox/search-js-react').then(mod => mod.Geocoder), {
        ssr: false
    });

    const mapRef = useRef();

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
        setFeaturePoint(features)
        setClickedPosition(event.lngLat);
    }, []);

    const handleMouseEnter = useCallback((event) => {

    })



    return (
        <>
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: 4.8357,
                    latitude: 45.7640,
                    zoom: 11
                }}
                onMouseMove={handleMouseEnter}
                onClick={handleClick}
                mapboxAccessToken={token}
                style={{ width: '100%', height: '100vh' }}
                projection='globe'
                mapStyle="mapbox://styles/mapbox/dark-v11"
            >
                <GeolocateControl position="bottom-right" />
                <NavigationControl position="bottom-right" />
                <DynamicGeocoder
                    accessToken={token}
                    options={{
                        language: 'fr',
                        country: 'FR'
                    }}
                    onRetrieve={handleRetrieve}
                    value="Rechercher un endroit"
                />
                {clickedPosition && (
                    <Marker longitude={clickedPosition.lng} latitude={clickedPosition.lat} />
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
        </>
    );
}
