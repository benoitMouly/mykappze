import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  resetStatus,
  checkEmailExists,
} from "../features/user/userSlice";
import { useNavigation } from "@react-navigation/native";
import { getErrorMsg } from "../utils/errorMessages";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { status, error: errorCode } = useSelector((state) => state.auth);
  const [errorMessage, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (errorCode) {
      setError(getErrorMsg(errorCode));
    } else {
      setError(null);
    }
    return () => {
      setError(null); // reset error when the component unmounts
    };
  }, [errorCode, setError]);

  const handleSubmit = () => {
    dispatch(checkEmailExists(email))
      .then(() => {
        dispatch(resetPassword(email));
        setIsEmailSent(true);
      })
      .catch((errorCode) => {
        console.log(errorCode);
      });
  };

  const handleResetStatus = () => {
    dispatch(resetStatus());
    setIsEmailSent(false);
    setEmail("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {/* <Text style={styles.title}>Inscription</Text> */}
        <Image
          style={styles.logo}
          source={require("../assets/transparent-without-circle.png")} // Remplacer par le chemin de votre image
        />
      </View>
      {!isEmailSent ? (
        <View style={styles.subContainer}>
          <Text style={styles.title}>Mot de passe oublié ?</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            {/* <Button title="Envoyer l'email de réinitialisation" onPress={handleSubmit} /> */}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                Envoyer l'email de réinitialisation{" "}
              </Text>
              <Icon
                style={styles.buttonIconElt}
                name="mail-outline"
                size={15}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.subContainerSend}>
          {status === "fulfilled" ? (
            <>
              <Text style={styles.title}>Email envoyé</Text>
              <Text style={styles.message}>
                Un email de réinitialisation a été envoyé à l'adresse suivante :
              </Text>
              <Text style={styles.userEmail}>{email}</Text>
            </>
          ) : status === "loading" ? (
            <Text style={styles.title}>Envoi en cours .. </Text>
          ) : (
            <>
              <Text style={styles.title}>
                Erreur lors de l'envoi de l'email
              </Text>
              <Text style={styles.error}>{errorMessage}</Text>
              {/* <Button
                style={styles.button}
                title="Réessayer"
                onPress={handleResetStatus}
              /> */}
              <TouchableOpacity style={styles.buttonRetry} onPress={handleResetStatus}>
                <Text style={styles.buttonText}>
                  Réessayer{" "}
                </Text>
                <Icon
                  style={styles.buttonIconElt}
                  name="mail-outline"
                  size={15}
                  color="#fff"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      <Text
        style={styles.redirect}
        onPress={() => navigation.navigate("Login")}
      >
        Retour à la page de connexion
      </Text>
    </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#26242d",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  subContainer: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 100,
  },
  subContainerSend: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 19,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  form: {
    padding: 10,
  },
  label: {
    fontSize: 18,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
  },
  message: {
    fontSize: 16,
    color: "#fff",
    // backgroundColor: "white",
    padding: 20,
    textAlign: "left",
    fontFamily: "WixMadeforDisplay-Regular",
  },
  userEmail: {
    fontSize: 16,
    color: "#fff",
    // backgroundColor: "white",
    // padding: 20,
    textAlign: "left",
    fontFamily: "WixMadeforDisplay-Bold",
  },
  error: {
    fontSize: 16,
    color: "red",
  },
  redirect: {
    fontSize: 16,
    color: "white",
    // textDecorationLine: 'underline',
    textAlign: "center",
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2F4F4F",
    padding: 10,
    borderRadius: 5,
  },
  buttonRetry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2F4F4F",
    padding: 10,
    borderRadius: 5,
    
  },
  buttonIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "WixMadeforDisplay-Bold",
  },

  buttonIconElt: {
    margin: 7,
  },
});

export default ForgotPasswordForm;
