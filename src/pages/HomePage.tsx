import React, {useState} from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Header } from "../components/general/header";


const HomePage: React.FC = () => {
  const { name, surname } = useSelector((state: RootState) => state.auth);


  return (
    <View style={styles.container}>
        {/* <Header/> */}
      <Text style={styles.greeting}>
        Bonjour {surname} {name}.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Accéder à vos associations</Text>
          {/* Ajoutez ici l'icône de votre choix */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Créer une association</Text>
          {/* Ajoutez ici l'icône de votre choix */}
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>Rejoindre un canal d'association</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2f4f4f",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 50,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    rowGap: 40,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginRight: 5,
  },
  text: {
    color: "white",
  },
});

export default HomePage;
