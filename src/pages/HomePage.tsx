import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import TextInputModal from "../components/general/TextUpdateModal";
import ConfirmationModal from "../components/general/ConfirmationModal";
import { joinAssociation } from "../features/associations/associationSlice";

type RootStackParamList = {
  ListingAssociation: undefined;
  CreateAssociation: undefined;
};

type ListingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ListingAssociation'>;
type CreateAssociationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateAssociation'>;


const HomePage: React.FC = () => {
  const { name, surname, uid } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<ListingScreenNavigationProp>();
  const navigationCreateAssociation = useNavigation<CreateAssociationScreenNavigationProp>();
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isEditNameVisible, setEditVisible] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [settedAssociationId, setAssociationId] = useState("");

  const dispatch = useDispatch();


  const handleJoinAssociation = (associationId) => {
    dispatch(joinAssociation({ userId: uid, associationId }))
    .then(() => {
      Alert.alert(
          "Association créée avec succès !",
          "L'association est désormais disponible dans votre listing.",
          [{ text: "OK", onPress: () => navigation.navigate('Main') }],
          { cancelable: false }
      );
  })
  .catch((error) => {
      console.error('Error adding association: ', error);
      Alert.alert(
          "L'association n'a pas pu être créée.",
          `En cas de besoin, transmettez le message d'erreur suivant au support : ${error}`,
          [{ text: "OK" }],
          { cancelable: false }
      );
  });
  }

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
          {/* <Image
            source={require("../assets/icons/icon-add.png")}
            style={styles.buttonIcon}
          /> */}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigationCreateAssociation.navigate('CreateAssociation')}>
          <Text style={styles.buttonText}>Créer une association</Text>
          <View style={styles.buttonGroupIcons}>
          <Image
            source={require("../assets/icons/icon-house.png")}
            style={styles.buttonIcon}
          />
<Text style={styles.text}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
              onPress={() => setEditVisible(true)}
              style={styles.sectionHeader}
            >
              <Text style={styles.text}>Rejoindre un canal d'associatioon</Text>
            </TouchableOpacity>

      <TextInputModal
        visible={isEditNameVisible}
        onClose={() => setEditVisible(false)} // Fermeture de la modale
        onConfirm={handleJoinAssociation}
        messageType={"Rejoindre une association"}
        subMessageType={"Veuillez rentrer l'appId de l'association"}
        onChangeText={setAssociationId}
        placeholder={"Exemple: 9dJh453HJszana ... "}

      />

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
    // fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    fontFamily: "WixMadeforDisplay-Bold",
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
    fontFamily: "WixMadeforDisplay-Bold",
  },
  buttonIcon: {
    marginRight: 5,
    width: 20,
    height: 20,
  },
  text: {
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
  },
});

export default HomePage;
