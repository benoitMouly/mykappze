import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { addCanal } from "../features/canals/canalSlice";

const CanalForm = () => {
  const { uid } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [citySector, setCitySector] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigation();

  const handleSubmit = () => {
    const data = {
      adminId: uid,
      name: name,
      email: email,
      citySector: citySector,
      postalCode: postalCode,
      phoneNumber: phoneNumber,
      role: [{ uid: uid, isAdmin: true }],
    };
    dispatch(addCanal({ userId: uid, canalData: data }))
      .then(() => {
        Alert.alert(
          "Canal créée avec succès !",
          "L'canal est désormais disponible dans votre listing.",
          [{ text: "OK", onPress: () => navigate.navigate("Main") }],
          { cancelable: false }
        );
      })
      .catch((error) => {
        console.error("Error adding canal: ", error);
        Alert.alert(
          "L'canal n'a pas pu être créée.",
          `En cas de besoin, transmettez le message d'erreur suivant au support : ${error}`,
          [{ text: "OK" }],
          { cancelable: false }
        );
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Ajouter une nouvelle canal</Text>
        </View>
        <Text style={styles.subtitle}>
          Veillez à remplir le maximum de champ possible. Vous pourrez malgré
          tout modifier ces infos par la suite.
        </Text>
        <View style={styles.form}>
          <Text style={styles.text}>Nom:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text style={styles.text}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.text}>Ville:</Text>
          <TextInput style={styles.input} value={citySector} onChangeText={setCitySector} />
          <Text style={styles.text}>Code postal:</Text>
          <TextInput
            style={styles.input}
            value={postalCode}
            onChangeText={setPostalCode}
          />
          <Text style={styles.text}>Téléphone :</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.handleSubmit}>
          <TouchableOpacity onPress={handleSubmit} style={styles.buttonsPicker}>
            <Text style={styles.buttonTextSubmit}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: "#2f4f4f",
    // height: 9000
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 20,
    padding: 15,
    marginTop: 30,
    // marginBottom: 30,
    fontFamily: "WixMadeforDisplay-Bold",
  },
  paragraph: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  form: {
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    fontFamily: "WixMadeforDisplay-Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonsPicker: {
    backgroundColor: "#2F2F2F",
    padding: 5,
    borderRadius: 3,
  },
  buttonText: {
    padding: 2,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
  },
  handleSubmit: {
    margin: 20,
    alignItems: 'center',
  },
  buttonTextSubmit: {
    padding: 2,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 20
  },
  subtitle:{
    marginBottom: 15,
    textAlign: "left",
    fontFamily: "WixMadeforDisplay-Regular",
    fontSize: 15,
    color: '#fff',
    padding: 15
  },
});

export default CanalForm;
