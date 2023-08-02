import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import  { store } from './src/store/store';
import * as Font from "expo-font";
// import LoginPage from './src/pages/LoginPage';
import  './src/firebaseConfig';  // Importez simplement votre configuration Firebase ici
import AppNavigator from './src/AppNavigator'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';


export async function registerForPushNotificationsAsync() {
  let token;

  try{
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  } catch(error){
    console.log(error)
  }


  return token;
}

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

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => console.log(token));

  //   // When a notification is received when the app is open
  //   const subscription = Notifications.addNotificationReceivedListener(notification => {
  //     console.log(notification);
  //   });

  //   // When a user interacts with a notification (e.g. taps on it)
  //   const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     subscription.remove();
  //     responseSubscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log(token));
  }, []);

  return (
    <SafeAreaProvider>

    <Provider store={store}>
    <AppNavigator />
    </Provider>

    </SafeAreaProvider>
  );
}

// export async function registerForPushNotificationsAsync() {
//   let token;
//   if (Constants.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }