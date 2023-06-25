import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Login from '../src/pages/LoginPage';
import Home from '../src/pages/HomePage';
import ListingAssociation from '../src/pages/ProfileUser';
import AssociationDetails from '../src/pages/AssociationDetails';
import Tricky from '../src/components/general/TrickyRoute'
import { Header }  from '../src/components/general/header';
import LoginPage from '../src/pages/LoginPage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


function MainStackNavigator() {
  const navigation = useNavigation();
  
  return (
    <Stack.Navigator >
      <Stack.Screen 
        name="Ouaip" 
        component={Home} 
        options={{ header: () => <Header navigation={navigation} />, headerShown: true}} 
      />
      <Stack.Screen 
        name="ListingAssociation" 
        component={ListingAssociation} 
        options={{ header: () => <Header navigation={navigation} />, headerShown: true}} 
      />
      <Stack.Screen 
        name="AssociationDetails" 
        component={AssociationDetails} 
        options={{ header: () => <Header navigation={navigation} />, headerShown: false}} 
      />
    </Stack.Navigator>
  );
}

function AppRouter() {
  // const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifiez l'état de connexion au démarrage de l'application
    AsyncStorage.getItem('userLoggedIn').then(value => {
      setUserLoggedIn(value === 'false');
      // console.log(userLoggedIn)
      setIsLoading(false);
    });
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={!userLoggedIn ? 'MyKappze' : 'Login'}>
        {!userLoggedIn && (
          <Drawer.Screen name="Login" component={Login} options={{headerShown: false}} />
        )}
        <Drawer.Screen name="MyKappze" component={MainStackNavigator} options={{headerShown: false}}  />
        {/* Ajouter ici les autres pages de l'application */}
        {/* Par exemple les paramètres de l'user, liens utiles, et autres */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default AppRouter;
