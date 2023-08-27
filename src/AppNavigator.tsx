import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
import { useDispatch, useSelector } from "react-redux";
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
import ModifyBillingPage from "./stripe/StripeInvoices";
import logoCatDefault from "./assets/transparent-without-circle.png";
import Invoices from "./pages/Invoices";
import { checkUserAuthStatus } from "../src/features/user/userSlice";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const getActiveRouteName = (state) => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

function MainStackNavigator() {
  const navigation = useNavigation();
  const {
    uid,
    isAuthenticated,
    name,
    surname,
    isMairie,
    licenseNumber,
    mairieName,
    associationName,
    userHasLicenseNumber,
  } = useSelector((state: RootState) => state.auth);


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
      {isMairie && (
        <Stack.Screen
          name="Subscribe"
          component={SubscribePage}
          options={{
            header: () => <Header navigation={navigation} />,
            headerShown: true,
          }}
        />
      )}

      {/* <Stack.Screen
        name="Invoices"
        component={ModifyBillingPage}
        options={{
          header: () => <Header navigation={navigation} />,
          headerShown: true,
        }}
      /> */}

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

      {isMairie && licenseNumber && (
        <Stack.Screen
          name="Invoices"
          component={Invoices}
          options={{
            header: () => <Header navigation={navigation} />,
            headerShown: true,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

function AppRouter() {
  const [isLoading, setIsLoading] = useState(true);
  const [userLoggedInStatus, setUserLoggedIn] = useState<boolean | null>(null);
  const dispatch = useAppDispatch();
  const [gotToken, setToken] = useState(null);


  useEffect(() => {
    dispatch(checkUserAuthStatus());
}, [dispatch]);

  // Get authentication state from Redux store
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  


  useEffect(() => {
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
            screenOptions={{
              drawerStyle: {
                backgroundColor: "#2f2f2f",
                width: 240,
              },
              drawerActiveTintColor: "red", // Couleur du texte actif
              drawerInactiveTintColor: "white", // Couleur du texte inactif
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            {null}
            <Drawer.Screen
              name="MyKappze"
              component={MainStackNavigator}
              options={{ headerShown: false }}
            />
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
  const { state } = props; // Destructurez l'état du tiroir
  const activeRouteName = getActiveRouteName(state);
  const {
    uid,
    isAuthenticated,
    name,
    surname,
    isMairie,
    licenseNumber,
    mairieName,
    associationName,
    userHasLicenseNumber,
  } = useSelector((state: RootState) => state.auth);

  // console.log(activeRouteName);
  return (
    <DrawerContentScrollView {...props} style={{ flex: 1, height: "100%" }}>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 60 }}>
          <Image source={logoCatDefault} style={{ width: 100, height: 100 }} />
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontFamily: "WixMadeforDisplay-Bold",
              marginTop: 10,
            }}
          >
            Kappze
          </Text>
        </View>

        <View>
          <DrawerItem
            label="Accueil"
            onPress={() => props.navigation.navigate("Main")}
            labelStyle={{
              color: activeRouteName === "Main" ? "#2f4f4f" : "white",
            }}
            style={{
              backgroundColor:
                activeRouteName === "Main" ? "white" : "transparent",
              borderRadius: 2,
              margin: 20,
              padding: 0,
            }}
            // labelStyle={{ color: "#ffffff" }}
          />
          <DrawerItem
            label="Paramètres"
            onPress={() => props.navigation.navigate("UserSettings")}
            labelStyle={{
              color: activeRouteName === "UserSettings" ? "#2f4f4f" : "white",
            }}
            style={{
              backgroundColor:
                activeRouteName === "UserSettings" ? "white" : "transparent",
              borderRadius: 2,
              margin: 20,
              padding: 0,
            }}
            // labelStyle={{ color: "#ffffff" }}
          />

          <DrawerItem
            label="Vétérinaires"
            onPress={() => props.navigation.navigate("NearByVet")}
            labelStyle={{
              color: activeRouteName === "NearByVet" ? "#2f4f4f" : "white",
            }}
            style={{
              backgroundColor:
                activeRouteName === "NearByVet" ? "white" : "transparent",
              borderRadius: 2,
              margin: 20,
              padding: 0,
            }}
            // labelStyle={{ color: "#ffffff" }}
          />

          {isMairie && (
            <DrawerItem
              label="S'abonner"
              onPress={() => props.navigation.navigate("Subscribe")}
              labelStyle={{
                color: activeRouteName === "Subscribe" ? "#f8491dc5" : "#fff",
              }}
              style={{
                backgroundColor:
                  activeRouteName === "Subscribe" ? "#fff" : "#e3c3c3",
                borderRadius: 2,
                margin: 20,
                padding: 0,
              }}
            />
          )}

          {licenseNumber && (
            <DrawerItem
              label="Factures"
              onPress={() => props.navigation.navigate("Invoices")}
              labelStyle={{
                color: activeRouteName === "Invoices" ? "#2f4f4f" : "white",
              }}
              style={{
                backgroundColor:
                  activeRouteName === "Invoices" ? "white" : "transparent",
                borderRadius: 2,
                margin: 20,
                padding: 0,
              }}
            />
          )}
        </View>

        <View style={{ marginBottom: 20, marginTop: 20 }}>
          <DrawerItem
            label="Déconnexion"
            onPress={() => dispatch(logoutAsync())}
            labelStyle={{ color: "#fff" }}
            // ... autres props
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default AppRouter;

