import { configureStore } from '@reduxjs/toolkit';
import capitalReducer from './reducer';

export const store = configureStore({
  reducer: {
    capitals: capitalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
