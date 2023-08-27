import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../store/store";
import { loginUser, registerUser } from "../features/user/userSlice.tsx";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Modal from "react-native-modal";
import { fetchSirenData } from "../features/siren/sirenSlice.js";

import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { getErrorMsg } from "../utils/errorMessages.js";

// Define the navigation type
type RootStackParamList = {
  Login: any;
  MyKappze: any;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const RegisterPage: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  // const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [errMail, setErrMail] = useState("");
  const [errName, setErrName] = useState("");
  const [errSurname, setErrSurname] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errPhoneNumber, setErrPhoneNumber] = useState("");
  const [err, setErr] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [errorMessage, setError] = useState("");
  const { error: errorCode } = useAppSelector((state) => state.auth);
  const sirenData = useAppSelector((state) => state.siren);
  const [userType, setUserType] = useState("visitor"); // 'visitor', 'mairie', 'association'
  const [associationName, setAssociationName] = useState("");

  const [siren, setSiren] = useState("");
  const [errSiren, setErrSiren] = useState("");

  useEffect(() => {
    if (errorCode) {
      setError(getErrorMsg(errorCode));
    } else {
      setError(null);
    }

    return () => {
      setError("null"); // réinitialisez l'erreur lorsque le composant se démonte
    };
  }, [errorCode]);

  const handleUserTypeChange = (type: string) => {
    setUserType(type);
  };

  const handleSirenChange = (text: string) => {
    setSiren(text);
  };

  // const navigation = useNavigation();
  // AsyncStorage.getAllKeys((err, keys) => {
  //   AsyncStorage.multiGet(keys, (error, stores) => {
  //     stores.map((result, i, store) => {
  //       console.log({ [store[i][0]]: store[i][1] });
  //       return true;
  //     });
  //   });
  // });
  // Dans Login
  const handleLogin = async () => {
    if (userType === "mairie" || userType === "association") {
      await dispatch(fetchSirenData(siren));
      console.log(sirenData);
      if (userType === "mairie" && !sirenData.isMairie) {
        setErrSiren("Le SIREN fourni n'appartient pas à une mairie.");
        return;
      } else if (userType === "association" && !sirenData.isAssociation) {
        setErrSiren("Le SIREN fourni n'appartient pas à une association.");
        return;
      }
    }
    if (
      email === "" ||
      password === "" ||
      name === "" ||
      surname === "" ||
      phone === ""
    ) {
      setModalTitle("Erreur");
      setModalMessage("Veuillez remplir tous les champs.");
      setModalVisible(true);
      return;
    }

    const actionResult = await dispatch(
      registerUser({
        email,
        password,
        name,
        surname,
        userType,
        siren: userType !== "visitor" ? siren : null,
        isMairie: userType === "mairie",
        mairieName: userType === "mairie" ? sirenData.mairieName : null,
        isAssociation: userType === "association",
        associationName:
          userType === "association" ? sirenData.associaionName : null,
      })
    );

    if (registerUser.fulfilled.match(actionResult)) {
      //   await AsyncStorage.setItem("@userIsLoggedIn", "true");
      try {
        // const token = await AsyncStorage.getItem("@userIsLoggedIn");
        // if (token === "true") {
        setModalTitle("Inscription réussie ! ");
        setModalMessage("Vous allez être redirigé vers la page de connexion.");
        setModalVisible(true);
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
        // }
      } catch (error) {
        console.log(error);
      }
    } else {
      if (actionResult.payload) {
        setModalMessage(actionResult.payload);
        setModalVisible(true);
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
          <Text style={styles.title}>Inscription</Text>
          <Image
            style={styles.logo}
            source={require("../assets/transparent-without-circle.png")} // Remplacer par le chemin de votre image
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vous êtes :</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity onPress={() => handleUserTypeChange("visitor")}>
              <Text
                style={[
                  styles.radioText,
                  userType === "visitor" && styles.selectedRadioText,
                ]}
              >
                Visiteur
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUserTypeChange("mairie")}>
              <Text
                style={[
                  styles.radioText,
                  userType === "mairie" && styles.selectedRadioText,
                ]}
              >
                Mairie
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUserTypeChange("association")}
            >
              <Text
                style={[
                  styles.radioText,
                  userType === "association" && styles.selectedRadioText,
                ]}
              >
                Association
              </Text>
            </TouchableOpacity>
          </View>

          {userType !== "visitor" && (
            <TextInput
              style={styles.input}
              placeholder="SIREN"
              placeholderTextColor="#FFF"
              onChangeText={handleSirenChange}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#FFF"
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Prenom"
            placeholderTextColor="#FFF"
            onChangeText={(text) => setSurname(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#FFF"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Telephone"
            placeholderTextColor="#FFF"
            onChangeText={(text) => setPhone(text)}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Mot de passe"
            placeholderTextColor="#FFF"
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>S'inscrire</Text>
            <Image
              source={require("../assets/icon-paw.png")}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            Déja inscrit ? Se connecter
          </Text>
          {errSiren && (
            <>
              <Text style={{ color: "red" }}>{errSiren}</Text>
            </>
          )}
        </View>

        <Modal
          isVisible={isModalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          animationInTiming={600}
          animationOutTiming={600}
        >
          <View style={styles.modalElt}>
            <Text style={styles.title}>{modalTitle}</Text>
            <Text style={{ color: "white" }}>{modalMessage}</Text>
            <Pressable
              style={styles.button}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "white" }}>Fermer</Text>
            </Pressable>
          </View>
        </Modal>
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
    marginTop: 40,
    marginBottom: 0,
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
  buttonIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "WixMadeforDisplay-Regular",
  },
  modalElt: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 30,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  radioText: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 2,
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    margin: 5,
    fontFamily: "WixMadeforDisplay-Regular",
  },
  selectedRadioText: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 2,
    color: "#2f2f2f",
    fontSize: 16,
    textAlign: "center",
    margin: 5,
    backgroundColor: '#fff',
    fontFamily: "WixMadeforDisplay-Regular",
  },
  label: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "WixMadeforDisplay-Regular",
  },
});

export default RegisterPage;
