import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import TextInputModal from "../components/general/TextUpdateModal";
import ConfirmationModal from "../components/general/ConfirmationModal";
import { joinCanal } from "../features/citiesSector/citySlice";

type RootStackParamList = {
  ListingCanal: undefined;
  CreateCanal: undefined;
};

type ListingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ListingCanal"
>;
type CreateCanalScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreateCanal"
>;

const HomePage: React.FC = () => {
  const { name, surname, uid, licenseNumber, isMairie, isAssociation, userHasLicenseNumber, mairieName } = useSelector(
    (state: RootState) => state.auth
  );
  const navigation = useNavigation<ListingScreenNavigationProp>();
  const navigationCreateCanal =
    useNavigation<CreateCanalScreenNavigationProp>();
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isEditNameVisible, setEditVisible] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [settedCanalId, setCanalId] = useState("");

  const dispatch = useDispatch();

  // console.log("LICENSE NUMBER : ", licenseNumber);

  const handleJoinCanal = (canalId) => {
    dispatch(joinCanal({ userId: uid, canalId }))
      .then(() => {
        Alert.alert(
          "Canal créée avec succès !",
          "Le canal est désormais disponible dans votre listing.",
          [{ text: "OK", onPress: () => navigation.navigate("Main") }],
          { cancelable: false }
        );
      })
      .catch((error) => {
        console.error("Error adding canal: ", error);
        Alert.alert(
          "Le canal n'a pas pu être créée.",
          `En cas de besoin, transmettez le message d'erreur suivant au support : ${error}`,
          [{ text: "OK" }],
          { cancelable: false }
        );
      });
  };

  return (
    <View style={styles.container}>
      {/* <Header/> */}
      <Text style={styles.greeting}>
        Bonjour {surname} {name}.
      </Text>

      <Text style={styles.greeting}>{mairieName}</Text>

      <Text style={styles.greeting}>{mairieName}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ListingCanal")}
        >
          <Text style={styles.buttonText}>Accéder à vos canals</Text>
          <View style={styles.buttonGroupIcons}>
            <Image
              source={require("../assets/icon-paw.png")}
              style={styles.buttonIcon}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigationCreateCanal.navigate("CreateCanal")
          }
        >
          <Text style={styles.buttonText}>Créer un canal</Text>
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
        <Text style={styles.text}>Rejoindre un canal</Text>
      </TouchableOpacity>

      <TextInputModal
        visible={isEditNameVisible}
        onClose={() => setEditVisible(false)} // Fermeture de la modale
        onConfirm={handleJoinCanal}
        messageType={"Rejoindre un canal"}
        subMessageType={"Veuillez rentrer l'appId du canal"}
        onChangeText={setCanalId}
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
    flexDirection: "row",
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
    columnGap: 5,
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
