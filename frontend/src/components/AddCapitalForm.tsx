import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCapitalAsync } from '../lib/thunks';

export default function AddCapitalForm() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(addCapitalAsync({
        id: null,
        name,
        country,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        color: 'green'
    }));

    setName('');
    setCountry('');
    setLongitude('');
    setLatitude('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="City Name"
        required
      />
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Country"
        required
      />
      <input
        type="number"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        placeholder="Longitude"
        required
      />
      <input
        type="number"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        placeholder="Latitude"
        required
      />
      <button type="submit">+</button>
    </form>
  );
}
