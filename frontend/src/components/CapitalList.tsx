import React, {useCallback, useState} from 'react';
import { RootState } from '../lib/store';
import { useDispatch, useSelector } from 'react-redux';
import { removeCapitalAsync, updateCapitalAsync } from '../lib/thunks';
import { Capital } from '../lib/types';
import AddCapitalForm from "./AddCapitalForm";
import { useMap } from './MapContext';

export default function CapitalList() {
  const dispatch = useDispatch();
  const { capitals } = useSelector((state: RootState) => state.capitals);
  const [editingCapital, setEditingCapital] = useState<Capital | null>(null);
  const { map } = useMap();

  const handleFlyToCapital = (id: number) => {
    if (!map) return;
    const capital = capitals.find((c) => c.id === id);
    if (!capital) return;

    if (import.meta.env.VITE_APP_USE_MAP === 'MAPBOX') {
      map.flyTo({
        center: [capital.longitude, capital.latitude],
        zoom: 8,
        essential: true
      })
    } else if (map instanceof google.maps.Map) {
      console.log("Springe zu:", capital.name, capital.latitude, capital.longitude);
      setTimeout(() => {
        map.panTo(new google.maps.LatLng(capital.latitude, capital.longitude));
        map.setZoom(8);
      }, 500);
    }
  };

  const handleEdit = (capital: Capital) => {
    setEditingCapital(capital);
  };

  const handleSaveEdit = () => {
    if (editingCapital) {
      dispatch(updateCapitalAsync(editingCapital));
      setEditingCapital(null);
    }
  };

  const handleRemoveMarker = useCallback((id: number) => {
    dispatch(removeCapitalAsync(id));
  }, [dispatch]);

  return !!capitals.length ? (
      <div className={'list'}>
        <AddCapitalForm />
        <ul>
          {capitals.map(c => (
              <li key={c.id}>
                {editingCapital && editingCapital.id === c.id ? (
                    <div>
                      <div className={'row'}>
                        <input
                            type="text"
                            value={editingCapital.name}
                            onChange={(e) => setEditingCapital({ ...editingCapital, name: e.target.value })}
                        />
                        <input
                            type="text"
                            value={editingCapital.country}
                            onChange={(e) => setEditingCapital({ ...editingCapital, country: e.target.value })}
                        />
                      </div>
                      <button onClick={handleSaveEdit}>Speichern</button>
                      <button onClick={() => setEditingCapital(null)}>Abbrechen</button>
                    </div>
                ) : (
                    <>
                      <div className={'row'} onClick={() => handleFlyToCapital(c.id)}>
                        #{c.id}: {c.name} ({c.country})
                      </div>
                      <button onClick={() => handleEdit(c)}>Bearbeiten</button>
                      <button onClick={() => handleRemoveMarker(c.id)}>X</button>
                    </>
                )}
              </li>
          ))}
        </ul>
      </div>
  ) : '';
}
