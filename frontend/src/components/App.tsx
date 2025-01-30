import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import Map from './Map';
import CapitalList from './CapitalList';
import AddCapitalForm from './AddCapitalForm';

export default function App() {
    const { loading, error } = useSelector((state: RootState) => state.capitals);

    return (
        <div className={'main'}>
            <div className={'bacon'}>
                {loading && <p>Lade Hauptstädte...</p>}
                {error && <p style={{ color: 'red' }}>Fehler: {error}</p>}
            </div>
            <Map />
            <AddCapitalForm />
            <CapitalList />
        </div>
    );
}
