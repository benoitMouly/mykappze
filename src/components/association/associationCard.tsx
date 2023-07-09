import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the navigation type
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AssociationDetails: { associationId: string }; // Add this line
};

type AssociationDetailsScreen = StackNavigationProp<
  RootStackParamList,
  "AssociationDetails"
>;

const AssociationCard = ({ association }) => {
  const navigation = useNavigation<AssociationDetailsScreen>();

  const handlePress = () => {
    navigation.navigate("AssociationDetails", {
      associationId: association.id,
    });
  };

  return (
    <View style={styles.container}>
      {association.image ? (
        <Image style={styles.image} source={{ uri: association.image }} />
      ) : (
        <Image style={styles.image} source={require('../../assets/transparent-without-circle.png') } />
      )}
      <Text style={styles.text}>{association.name}</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Accéder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "45%",
    borderRadius: 2,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
  },
  text: {
    marginBottom: 10,
  },
  image: {
    width: 100, // Remplacez par les dimensions souhaitées
    height: 100, // Remplacez par les dimensions souhaitées
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2F4F4F",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
  },
});

export default AssociationCard;
