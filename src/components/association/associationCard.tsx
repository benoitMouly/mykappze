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
      // id: association.id,
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
      <Text style={styles.textName}>{association.name}</Text>
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
    // elevation: 2,
    marginBottom: 20,
    padding: 5,
    alignItems: "center",
  },
  textName: {
    marginBottom: 10,
    fontFamily: "WixMadeforDisplay-Bold",
    alignSelf: "flex-start",
  },
  // text: {
  //   marginBottom: 10,
  //   fontFamily: "WixMadeforDisplay-Bold",
  //   alignSelf: "center",
  // },
  image: {
    width: 100, // Remplacez par les dimensions souhaitées
    height: 100, // Remplacez par les dimensions souhaitées
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2F4F4F",
    padding: 10,
    borderRadius: 2,
    alignItems: 'center',
    width: "100%",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "WixMadeforDisplay-Bold",
  },
});

export default AssociationCard;
