import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, OverlayView } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCapitalsAsync, removeCapitalAsync, updateMarkerColorAsync } from '../lib/thunks';
import { Capital } from '../lib/types';
import { RootState } from '../lib/store';

const center = { lat: 50, lng: 10 };

export default function CapitalMap() {
    const dispatch = useDispatch();

    const { capitals } = useSelector((state: RootState) => state.capitals);
    const [selectedMarker, setSelectedMarker] = useState<Capital | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

    const googleMapsApiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

    const onLoad = useCallback(() => {
        if (window.google && window.google.maps && !isMapLoaded) {
            setIsMapLoaded(true);
            dispatch(fetchCapitalsAsync());
        }
    }, [dispatch, isMapLoaded]);

    const handleUpdateMarkerColor = useCallback((id: number) => {
        const newColor = prompt('Neue Farbe in Hex:');
        if (newColor) {
            dispatch(updateMarkerColorAsync({id, color: newColor}));
        }
    }, [dispatch]);

    const handleRemoveMarker = useCallback((id: number) => {
        dispatch(removeCapitalAsync(id));
        setSelectedMarker(null);
    }, [dispatch]);

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <div className={'map'}>
                <GoogleMap
                    center={center}
                    zoom={3}
                    onLoad={onLoad}
                >
                    {capitals.map((capital) => (
                        <OverlayView
                            key={capital.id}
                            position={{ lat: capital.latitude, lng: capital.longitude }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <div
                                className={'marker'}
                                style={{
                                    backgroundColor: capital.color || 'red'
                                }}
                                onClick={() => setSelectedMarker(capital)}
                            />
                        </OverlayView>
                    ))}

                    {selectedMarker && (
                        <OverlayView
                            position={{
                                lat: selectedMarker.latitude,
                                lng: selectedMarker.longitude,
                            }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <div className={'marker-info'}>
                                <h3>{selectedMarker.name}</h3>
                                <p>{selectedMarker.country}</p>
                                <button onClick={() => handleUpdateMarkerColor(selectedMarker.id)}>
                                    Ändere Farbe
                                </button>
                                <button onClick={() => handleRemoveMarker(selectedMarker.id)}>
                                    Lösche Marker
                                </button>
                            </div>
                        </OverlayView>
                    )}
                </GoogleMap>
            </div>
        </LoadScript>
    );
}