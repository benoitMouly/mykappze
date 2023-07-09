import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux'
import authReducer from '../features/user/userSlice';
import associationsReducer from '../features/associations/associationSlice.tsx';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import citiesReducer from '../features/cities/citySlice';
import sectorsReducer from '../features/sectors/sectorSlice';
import animalsReducer from '../features/animals/animalSlice';
import associationsUsersReducer from '../features/associations/associationUsersSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        associations: associationsReducer,
        cities: citiesReducer,
        animals: animalsReducer,
        sectors: sectorsReducer,
        associationUsers: associationsUsersReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
