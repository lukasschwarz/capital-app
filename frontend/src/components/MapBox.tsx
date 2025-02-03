import React, { useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCapitalsAsync, removeCapitalAsync, updateMarkerColorAsync } from '../lib/thunks';
import { RootState } from '../lib/store';
import { useMap } from './MapContext';

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;

let markers = {}

export default function CapitalMap() {
    const dispatch = useDispatch();
    const { capitals } = useSelector((state: RootState) => state.capitals);
    const { map, setMap } = useMap();

    useEffect(() => {
        const initializeMap = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/standard',
            center: [10, 50],
            zoom: 3
        });

        initializeMap.on('load', () => dispatch(fetchCapitalsAsync()));
        setMap(initializeMap);

        return () => initializeMap.remove();
    }, [dispatch]);

    useEffect(() => {
        if (!map) return;

        capitals.forEach((capital) => {
            const markerElement = document.createElement('div');
            markerElement.className = 'openBoxMarker';
            markerElement.style.backgroundColor = capital.color || 'red';

            const popupContent = `
                <div class="marker-info openBox">
                    <h3>${capital.name}</h3>
                    <p>${capital.country}</p>
                    <button id="changeColorBtn_${capital.id}">
                        Ändere Farbe
                    </button>
                    <button id="removeMarkerBtn_${capital.id}">
                        Lösche Marker
                    </button>
                </div>
            `;

            const popup = new mapboxgl.Popup({ closeButton: null })
                .setLngLat([capital.longitude, capital.latitude])
                .setHTML(popupContent)
                .on('open', () => {
                    const changeColorButton = document.getElementById(`changeColorBtn_${capital.id}`);
                    if (changeColorButton) {
                        changeColorButton.addEventListener('click', () => handleUpdateMarkerColor(capital.id));
                    }

                    const removeMarkerButton = document.getElementById(`removeMarkerBtn_${capital.id}`);
                    if (removeMarkerButton) {
                        removeMarkerButton.addEventListener('click', () => handleRemoveMarker(capital.id));
                    }
                });

            markers[capital.id] = new mapboxgl.Marker(markerElement)
                .setLngLat([capital.longitude, capital.latitude])
                .setPopup(popup)
                .addTo(map);
        });
    }, [capitals, map]);

    const handleUpdateMarkerColor = useCallback((id: number) => {
        const newColor = prompt('Neue Farbe in Hex:');
        if (newColor) {
            dispatch(updateMarkerColorAsync({ id, color: newColor }));
        }
    }, [dispatch]);

    const handleRemoveMarker = useCallback((id: number) => {
        dispatch(removeCapitalAsync(id));
        markers[id].remove();
    }, [dispatch]);

    return (
        <div id={'map'}></div>
    );
}
