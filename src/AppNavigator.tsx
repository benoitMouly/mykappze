import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Login from "../src/pages/LoginPage";
import { logout, logoutAsync } from "../src/features/user/userSlice";
import Home from "../src/pages/HomePage";
import ListingCanal from "../src/pages/ProfileUser";
import CanalDetails from "../src/pages/CanalDetails";
import AddCat from "../src/pages/AddCat";
import AnimalDetails from "../src/pages/CatProfile";
import { Header } from "../src/components/general/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "./store/store";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import RegisterPage from "./pages/RegisterPage";
import EditAnimalDetails from "./pages/EditAnimalDetails";
import CitySectorDetails from "./pages/CitySectorDetails";
import EditCanalDetails from "./pages/EditCanalDetails";
import SettingsUser from "./pages/SettingsUser";
import CanalForm from "./pages/CanalCreate";
import ForgotPasswordForm from "./pages/ForgotPassword";
import Veterinaires from "./pages/NearbyVet";
import SubscribePage from "./pages/SubscribePage";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainStackNavigator() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={ListingCanal}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Subscribe"
        component={SubscribePage}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ListingCanal"
        component={ListingCanal}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddCat"
        component={AddCat}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AnimalDetails"
        component={AnimalDetails}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditAnimalDetails"
        component={EditAnimalDetails}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CanalDetails"
        component={CanalDetails}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="CitySectorDetails"
        component={CitySectorDetails}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditCanal"
        component={EditCanalDetails}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserSettings"
        component={SettingsUser}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateCanal"
        component={CanalForm}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="NearByVet"
        component={Veterinaires}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

function AppRouter() {
  const [isLoading, setIsLoading] = useState(true);
  const [userLoggedInStatus, setUserLoggedIn] = useState<boolean | null>(null);
  const dispatch = useAppDispatch();

  // Get authentication state from Redux store
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Update userLoggedInStatus when isAuthenticated changes
    setUserLoggedIn(isAuthenticated);
    setIsLoading(false);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@userIsLoggedIn");
    // setUserLoggedIn(false);
    dispatch(logout(null));
  };

  return (
    <NavigationContainer>
      {!isLoading ? (
        isAuthenticated ? (
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            {null}
            <Drawer.Screen
              name="MyKappze"
              component={MainStackNavigator}
              options={{ headerShown: false }}
            />
            {/* Add other app screens here */}
            {/* <Drawer.Screen name="MyKappze" component={MainStackNavigator} /> */}
          </Drawer.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordForm}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        )
      ) : null}
    </NavigationContainer>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const dispatch = useAppDispatch();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Accueil"
        onPress={() => props.navigation.navigate("Main")}
      />
      <DrawerItem
        label="Paramètres"
        onPress={() => props.navigation.navigate("UserSettings")}
      />

      <DrawerItem
        label="Vétérinaires"
        onPress={() => props.navigation.navigate("NearByVet")}
      />

<DrawerItem
        label="S'abonner"
        onPress={() => props.navigation.navigate("Subscribe")}
      />

      <DrawerItem label="Déconnexion" onPress={() => dispatch(logoutAsync())} />
    </DrawerContentScrollView>
  );
}

export default AppRouter;
