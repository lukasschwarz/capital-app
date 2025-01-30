import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchCapitalsAsync,
    addCapitalAsync,
    updateCapitalAsync,
    removeCapitalAsync,
    updateMarkerColorAsync,
} from './thunks';
import { Capital } from './types';

interface CapitalState {
    capitals: Capital[];
    loading: boolean;
    error: string | null;
}

const initialState: CapitalState = {
    capitals: [],
    loading: false,
    error: null,
};

const capitalSlice = createSlice({
    name: 'capitals',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCapitalsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCapitalsAsync.fulfilled, (state, action: PayloadAction<Capital[]>) => {
                state.loading = false;
                state.capitals = action.payload;
            })
            .addCase(fetchCapitalsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addCapitalAsync.fulfilled, (state, action: PayloadAction<Capital>) => {
                state.capitals.unshift(action.payload);
            })

            .addCase(updateCapitalAsync.fulfilled, (state, action: PayloadAction<Capital>) => {
                const index = state.capitals.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.capitals[index] = action.payload;
                }
            })

            .addCase(removeCapitalAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.capitals = state.capitals.filter((c) => c.id !== parseInt(action.payload));
            })

            .addCase(updateMarkerColorAsync.fulfilled, (state, action: PayloadAction<Capital>) => {
                const index = state.capitals.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.capitals[index] = action.payload;
                }
            });
    },
});

export default capitalSlice.reducer;
