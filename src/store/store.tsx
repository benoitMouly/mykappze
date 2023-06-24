import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux'
import authReducer from '../features/user/userSlice';
// import associationsReducer from '../features/associations/associationSlice.js';
// import citiesReducer from '../features/cities/citySlice.js';
// import sectorsReducer from '../features/sectors/sectorSlice.js';
// import animalsReducer from '../features/animals/animalSlice.js';
// import associationsUsersReducer from '../features/associations/associationUsersSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // associations: associationsReducer,
        // cities: citiesReducer,
        // animals: animalsReducer,
        // sectors: sectorsReducer,
        // associationUsers: associationsUsersReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
