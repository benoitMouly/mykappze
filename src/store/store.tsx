import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "../features/user/userSlice";
import licenceReducer from "../features/licences/licenceSlice.tsx";
import canalsReducer from "../features/canals/canalSlice.tsx";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import citiesSectorReducer from "../features/citiesSector/citySectorSlice";
import animalsReducer from "../features/animals/animalSlice";
import canalsUsersReducer from "../features/canals/canalUsersSlice.tsx";
import notificationSlice from "../features/notifications/notificationSlice.tsx";
import commentsReducer from "../features/animals/commentsSlice.tsx";
import sirenReducer from "../features/siren/sirenSlice.js";
import billingReducer from "../features/payments/billingSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    licences: licenceReducer,
    canals: canalsReducer,
    siren: sirenReducer,
    citiesSector: citiesSectorReducer,
    animals: animalsReducer,
    canalUsers: canalsUsersReducer,
    notifications: notificationSlice,
    comments: commentsReducer,
    billing: billingReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
  // devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
