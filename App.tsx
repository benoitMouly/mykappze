import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import  { store } from './src/store/store';
// import LoginPage from './src/pages/LoginPage';
import  './src/firebaseConfig';  // Importez simplement votre configuration Firebase ici
import AppNavigator from './src/AppNavigator'

export default function App() {
  return (
    <SafeAreaProvider>

    <Provider store={store}>
    <AppNavigator />
    </Provider>

    </SafeAreaProvider>
  );
}

