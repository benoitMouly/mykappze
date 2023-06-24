import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { useAppDispatch } from '../store/store'
import { loginUser } from "../features/user/userSlice.tsx";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet, Alert
} from "react-native";
import * as Font from "expo-font";

// Define the navigation type
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;



const LoginPage: React.FC = () => {

  const navigation = useNavigation<LoginScreenNavigationProp>();
  // const navigation = useNavigation();

  
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const navigation = useNavigation();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    
    const actionResult = await dispatch(loginUser({ email, password }));
    console.log(actionResult)
    if (loginUser.fulfilled.match(actionResult)) {
      
      console.log("Bonjour, nous sommes connectés.");
      navigation.navigate("Home");
    } else {
      // Si l'action échoue, affichez le message d'erreur
      if (actionResult.payload) {
        console.log('actionResult a un payload')
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
          <Text style={styles.title}>Kappze</Text>
          <Image
            style={styles.logo}
            source={require("../assets/transparent-without-circle.png")} // Remplacer par le chemin de votre image
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#FFF" onChangeText={text => setEmail(text)} />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#FFF"
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
            <Image
              source={require("../assets/icon-paw.png")}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
          <Text style={styles.link} onPress={() => {}}>
            Pas encore de compte ? S'inscrire
          </Text>
          <Text style={styles.link} onPress={() => {}}>
            Mot de passe oublié
          </Text>
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
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2F4F4F",
    padding: 20,
    borderRadius: 5,
  },
  buttonIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "WixMadeforDisplay-Regular",
  },
});

export default LoginPage;
