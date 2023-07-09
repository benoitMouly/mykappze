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
import ListingAssociation from "../src/pages/ProfileUser";
import AssociationDetails from "../src/pages/AssociationDetails";
import { Header } from "../src/components/general/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "./store/store";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import RegisterPage from "./pages/RegisterPage";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainStackNavigator() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={Home}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ListingAssociation"
        component={ListingAssociation}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AssociationDetails"
        component={AssociationDetails}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: false,
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
            <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }}/>
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
        label="Home"
        onPress={() => props.navigation.navigate("Home")}
      />
      <DrawerItem label="Déconnexion" onPress={() => dispatch(logoutAsync())} />
    </DrawerContentScrollView>
  );
}

export default AppRouter;
