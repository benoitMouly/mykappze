// ProfileUser.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { fetchCanals } from "../features/canals/canalSlice";
import CanalCard from "../components/canal/canalCard";
import { RootState, useAppDispatch } from "../store/store";
import { joinCanal } from "../features/canals/canalSlice";

import LoadingPage from "../components/general/loadingPage"; // Importez votre composant de chargement ici
import TextInputModal from "../components/general/TextUpdateModal";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingScreen from "../components/general/loadingPage";
// import { isLoading } from "expo-font";

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

const ProfileUser = () => {
  const {
    uid,
    isAuthenticated,
    name,
    surname,
    isMairie,
    licenseNumber,
    mairieName,
    associationName,
    userHasLicenseNumber,
  } = useSelector((state: RootState) => state.auth);
  const {
    data: canals,
    status,
    error,
  } = useSelector((state: RootState) => state.canals);
  const dispatch = useAppDispatch();

  const navigation = useNavigation<ListingScreenNavigationProp>();
  const navigationCreateCanal =
    useNavigation<CreateCanalScreenNavigationProp>();

  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isEditNameVisible, setEditVisible] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [settedCanalId, setCanalId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  useEffect(() => {
    if (isAuthenticated && uid) {
      dispatch(fetchCanals(uid));
      // setIsLoading(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    console.log(canals);
  }, [dispatch, uid, isAuthenticated]);

  if (status === 'loading') {
    return <LoadingScreen isLoading={true} />;
}

  return (
    <ScrollView style={styles.container}>

      {isLoading ? (
         <LoadingScreen isLoading={false}/>
      ) : (null)}
      {canals.length ? (
        <>
          <Text style={styles.greeting}>
            Bonjour {surname} {name}.
          </Text>

          {associationName || mairieName ? (
            <Text style={styles.legacyName}>
              {associationName ? associationName : mairieName}
            </Text>
          ) : null}

          <View style={styles.buttonContainer}>
            {isMairie && licenseNumber && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigationCreateCanal.navigate("CreateCanal")}
              >
                <Text style={styles.buttonText}>Créer</Text>
                <View style={styles.buttonGroupIcons}>
                  <Icon name="home-outline" size={24} color="#fff" />
                  <Text style={styles.text}>+</Text>
                </View>
              </TouchableOpacity>
            )}

            {!isMairie && (
              <TouchableOpacity
                onPress={() => setEditVisible(true)}
                style={styles.buttonJoinCanal}
              >
                <Text style={styles.buttonText}>Rejoindre</Text>
                <View style={styles.buttonGroupIcons}>
                  <Icon name="enter-outline" size={24} color="#fff" />
                  <Text style={styles.text}>+</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <TextInputModal
            visible={isEditNameVisible}
            onClose={() => setEditVisible(false)} // Fermeture de la modale
            onConfirm={handleJoinCanal}
            messageType={"Rejoindre un canal"}
            subMessageType={"Veuillez rentrer l'appId du canal"}
            onChangeText={setCanalId}
            placeholder={"Exemple: 9dJh453HJszana ... "}
          />

          <Text style={styles.title}>Vos canaux :</Text>
          <View style={styles.listCanal}>
            {canals.map((canal) => (
              <CanalCard key={canal.id} canal={canal} />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.authPage}>
          <Text>Vous n'avez pas encore de canaux. </Text>
          <Text>Achetez une licence</Text>
          {/* <button className="button-general" style={styles.button}
                onPress={() => navigationCreateCanal.navigate("Subscribe")}>
                  Acheter une licence
          </button> */}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#2F4F4F",
  },
  title: {
    fontSize: 17,
    color: "#fff",
    padding: 10,
    marginTop: 0,
    fontFamily: "WixMadeforDisplay-Bold",
  },
  listCanal: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 0,
    columnGap: 10,
    paddingTop: 25,
    paddingHorizontal: 0,
  },
  authPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    color: "white",
    marginVertical: 30,
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: "center",
  },
  legacyName: {
    fontSize: 14,
    color: "white",
    marginVertical: 30,
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: "center",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    rowGap: 3,
    marginVertical: 20,
  },

  buttonGroupIcons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // width: "100%",
  },

  button: {
    backgroundColor: "#282c34",
    borderRadius: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    columnGap: 8,
    width: "100%",
    borderWidth: 2,
    borderColor: "#282c34",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  buttonJoinCanal: {
    backgroundColor: "transparent",
    borderRadius: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    width: "100%",
    columnGap: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    marginRight: 5,
    fontFamily: "WixMadeforDisplay-Regular",
    textAlign: "center",
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

export default ProfileUser;
