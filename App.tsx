import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import  { store } from './src/store/store';
import * as Font from "expo-font";
// import LoginPage from './src/pages/LoginPage';
import  './src/firebaseConfig';  // Importez simplement votre configuration Firebase ici
import AppNavigator from './src/AppNavigator'



export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      // "WixMadeforDisplay-Regular": require("../../assets/fonts/WixMadeforDisplay-Regular.ttf"),
      // "WixMadeforDisplay-Bold": require("../../assets/fonts/WixMadeforDisplay-Bold.otf"), // charge également la variante en gras
      "WixMadeforDisplay-Regular": require("./src/assets/fonts/WixMadeforDisplay-Regular.ttf"),
      "WixMadeforDisplay-Bold": require("./src/assets/fonts/WixMadeforDisplay-Bold.otf"), // charge également la variante en gras
    });
    setFontsLoaded(true);
  };
  
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <SafeAreaProvider>

    <Provider store={store}>
    <AppNavigator />
    </Provider>

    </SafeAreaProvider>
  );
}

