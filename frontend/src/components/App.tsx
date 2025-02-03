import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import GoogleMap from './GoogleMap';
import MapBox from './MapBox';
import CapitalList from './CapitalList';
import { MapProvider } from './MapContext';

export default function App() {
    const { loading, error } = useSelector((state: RootState) => state.capitals);

    return (
        <div className={'main'}>
            <div className={'bacon'}>
                {loading && <p>Lade Hauptstädte...</p>}
                {error && <p style={{ color: 'red' }}>Fehler: {error}</p>}
            </div>
            <MapProvider>
                { import.meta.env.VITE_APP_USE_MAP === 'MAPBOX' ? <MapBox /> : <GoogleMap /> }
                <CapitalList />
            </MapProvider>
        </div>
    );
}
