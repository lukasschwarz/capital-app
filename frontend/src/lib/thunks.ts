import { createAsyncThunk } from '@reduxjs/toolkit';
import { Capital } from './types';

export const fetchCapitalsAsync = createAsyncThunk<Capital[], void>(
    'capitals/fetchCapitals',
    async (_, { rejectWithValue }) => {
      try {
        const res = await fetch('http://localhost:3000/capital');
        if (!res.ok) throw new Error('Fehler beim Laden der Hauptstädte');
        return await res.json();
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
);

export const addCapitalAsync = createAsyncThunk<Capital, Capital>(
    'capitals/addCapital',
    async (capital, { rejectWithValue }) => {
      try {
        const res = await fetch('http://localhost:3000/capital', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capital),
        });
        if (!res.ok) throw new Error('Fehler beim Hinzufügen der Hauptstadt');
        return await res.json();
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
);

export const updateCapitalAsync = createAsyncThunk<Capital, Capital>(
    'capitals/updateCapital',
    async (capital, { rejectWithValue }) => {
      try {
        const res = await fetch(`http://localhost:3000/capital/${capital.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capital),
        });
        if (!res.ok) throw new Error('Fehler beim Aktualisieren der Hauptstadt');
        return await res.json();
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
);

export const removeCapitalAsync = createAsyncThunk<string, string>(
    'capitals/removeCapital',
    async (id, { rejectWithValue }) => {
      try {
        const res = await fetch(`http://localhost:3000/capital/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Fehler beim Entfernen der Hauptstadt');
        return id;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
);

export const updateMarkerColorAsync = createAsyncThunk<Capital, { id: number; color: string }>(
    'capitals/updateMarkerColor',
    async ({ id, color }, { rejectWithValue }) => {
      try {
        const res = await fetch(`http://localhost:3000/capital/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color }),
        });
        if (!res.ok) throw new Error('Fehler beim Aktualisieren der Markerfarbe');
        return await res.json();
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
);