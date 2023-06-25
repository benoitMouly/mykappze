import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ListingAssociation: any;
};

type ListingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ListingAssociation'>;


const HomePage: React.FC = () => {
  const { name, surname } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<ListingScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* <Header/> */}
      <Text style={styles.greeting}>
        Bonjour {surname} {name}.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListingAssociation')}>
          <Text style={styles.buttonText}>Accéder à vos associations</Text>
          <View style={styles.buttonGroupIcons}>
          <Image
            source={require("../assets/icon-paw.png")}
            style={styles.buttonIcon}
          />
          <Image
            source={require("../assets/icons/icon-add.png")}
            style={styles.buttonIcon}
          />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Créer une association</Text>
          <View style={styles.buttonGroupIcons}>
          <Image
            source={require("../assets/icons/icon-house.png")}
            style={styles.buttonIcon}
          />
          <Image
            source={require("../assets/icons/icon-add.png")}
            style={styles.buttonIcon}
          />
          </View>
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
    rowGap: 70,
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

  buttonGroupIcons: {
    display: "flex",
    flexDirection: 'row'
  },

  button: {
    backgroundColor: "black",
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginHorizontal: 5,
    flexDirection: "row",
    width: 350,
    alignItems: "flex-start",
    justifyContent: "space-between",
    columnGap: 5
  },
  buttonText: {
    color: "white",
    marginRight: 5,
  },
  buttonIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  text: {
    color: "white",
  },
});

export default HomePage;
