import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../store/store";
import { loginUser } from "../features/user/userSlice.tsx";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Google from "expo-auth-session/providers/google";
import firebase from "firebase/compat/app";
import { checkUserAuthStatus } from "../features/user/userSlice.tsx";

import * as WebBrowser from "expo-web-browser";

import "firebase/auth";

import * as AuthSession from "expo-auth-session";

import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

WebBrowser.maybeCompleteAuthSession();

// web : 169421691212-b6edhc4v6tl2g0s5fcbgecp796ipqin0.apps.googleusercontent.com
// IOS : 169421691212-gnfq5fkabqbr8ng611emgmm35nd3vt7b.apps.googleusercontent.com
// Android : 169421691212-jiefe2qrfhlv62ha45cj67kflc6e9brf.apps.googleusercontent.com

// Define the navigation type
type RootStackParamList = {
  LoginPage: any;
  MyKappze: any;
  Register: any;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register",
>;

const LoginPage: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  // const navigation = useNavigation();
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);


  const [fontsLoaded, setFontsLoaded] = useState(false);

  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRequestReady, setIsRequestReady] = useState(false);

  useEffect(() => {
    dispatch(checkUserAuthStatus());
  }, [dispatch]);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    const actionResult = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(actionResult)) {
      await AsyncStorage.setItem("@userIsLoggedIn", "true");
      try {
        const token = await AsyncStorage.getItem("@userIsLoggedIn");
        if (token === "true") {
          // console.log(token);
          
          console.log(user);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // Si l'action échoue, affichez le message d'erreur
      if (actionResult.payload) {
        console.log("actionResult a un payload");
        Alert.alert("Erreur", actionResult.payload);
      }
    }
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      "WixMadeforDisplay-Regular": require("../assets/fonts/WixMadeforDisplay-Regular.ttf"),
      "WixMadeforDisplay-Bold": require("../assets/fonts/WixMadeforDisplay-Bold.otf"), // charge également la variante en gras
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);
  if (!fontsLoaded) {
    return <View />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {user && <ShowUserInfo />}
          <Text style={styles.title}>Kappze</Text>
          <Image
            style={styles.logo}
            source={require("../assets/transparent-without-circle.png")} // Remplacer par le chemin de votre image
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#FFF"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Mot de passe"
            placeholderTextColor="#FFF"
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
            <Image
              source={require("../assets/icon-paw.png")}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          <View style={{ margin: 40 }}>
            {/* <TouchableOpacity
              style={styles.buttonGoogle}
              onPress={() => promptAsync()}
            >
              <Text style={styles.buttonText}>Se connecter avec Google</Text>

              <Icon name="logo-google" size={24} color="#fff" />
            </TouchableOpacity> */}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Register")}
            >
              Pas encore de compte ? S'inscrire
            </Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              Mot de passe oublié
            </Text>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#2F4F4F',
    backgroundColor: "#26242d",
    justifyContent: "center", // Centre les éléments verticalement
  },
  titleContainer: {
    alignItems: "center", // Centre les éléments horizontalement
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  logo: {
    width: 100,
    height: 100,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color: "white",
  },
  link: {
    color: "white",
    marginTop: 20,
    marginBottom: 20,
    textDecorationLine: "underline",
    alignSelf: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2F4F4F",
    padding: 20,
    borderRadius: 5,
  },
  // buttonGoogle: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   backgroundColor: "blue",
  //   padding: 20,
  //   borderRadius: 5,
  // },
  buttonGoogle: {
    flexDirection: "row", // pour avoir l'icône et le texte côte à côte
    alignItems: "center", // pour centrer verticalement l'icône et le texte
    justifyContent: "center", // pour centrer horizontalement l'icône et le texte
    backgroundColor: "#4285F4", // couleur de fond typique de Google
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "WixMadeforDisplay-Regular",
    marginRight: 10,
  },
});

export default LoginPage;
