// AppNavigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './HomePage.tsx';
import ProfileUser from './ProfileUser.tsx';
import Settings from './Settings.jsx';

const Stack = createStackNavigator();

export const AppNavigation: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }}/>
                <Stack.Screen name="Profile" component={ProfileUser} options={{ headerShown: false }}/>
                <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
