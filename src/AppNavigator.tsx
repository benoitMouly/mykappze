import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { Header } from '../src/components/general/header';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={({ navigation }) => ({
          header: () => <Header navigation={navigation} />, // Utiliser Header comme en-tête
          headerShown: true, // Montrer l'en-tête
          headerLeft: () => null, // Désactiver le bouton hamburger
          title: '', // Désactiver le titre de l'écran
        })}
      >
        <Drawer.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <Drawer.Screen name="Home" component={HomePage} />
        {/* Ajoutez ici tous les autres écrans que vous voulez dans le Drawer */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
