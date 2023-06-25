import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface AssociationDetails {
  associationId: string | null;
  route: any | null;
  // Autres propriétés...
}

const AssociationDetails = ({ route }) => {
  const { associationId } = route.params;

  const {
    data: associations,
    status,
    error,
  } = useSelector((state: RootState) => state.associations);

  // Utilisation de find pour obtenir l'association spécifique
  const association = associations.find((asso) => asso.id === associationId);

  if (status === "loading") {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nom: {association?.name}</Text>
      <Text style={styles.text}>Ville: {association?.city}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
});

export default AssociationDetails;
