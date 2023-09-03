import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { fetchCities} from "../features/citiesSector/citySectorSlice";
import { fetchAnimalsByCanal } from "../features/animals/animalSlice";
import {
  fetchCanalUsers,
  removeUserFromCanal,
} from "../features/canals/canalUsersSlice";
import { useRoute } from "@react-navigation/native";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";
import AnimalList from "../components/animals/animalList";
import AnimalFilters from "../components/animals/animalFilter";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import EditableImage from "../components/general/EditableImage";
import TextInputModal from "../components/general/TextUpdateModal";
import {
  changeUserRole,
  updateCanal,
  updateCanalImage,
} from "../features/canals/canalSlice";
import SelectModal from "../components/general/EditableSelect";
import ConfirmationModal from "../components/general/ConfirmationModal";
import CustomAlert from "../components/general/CustomAlert";
import { HeaderEditAnimal } from "../components/general/headerEditAnimal";
import * as Clipboard from 'expo-clipboard';
import { createAndSendNotification } from "../features/notifications/notificationSlice";
// définir les interfaces
interface Canal {
  id: string;
  data: any[]; // Changez `any` en type approprié
  // Autres propriétés...
}

interface Animal {
  isSterilise: boolean;
  hasIdNumber: boolean;
  isBelonged: boolean;
  // Ajoutez d'autres champs ici si nécessaire
}

interface User {
  id: string;
  isAdmin: boolean;
  // Ajoutez d'autres champs ici si nécessaire
}

interface CitySector {
  // Propriétés pour la ville...
}

interface DataState<T> {
  data: T[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  // Ajoutez ici d'autres champs si nécessaire
}

// Utilisez cette interface dans l'interface RootState
interface RootState {
  canals: DataState<Canal>;
  citiesSector: DataState<CitySector>;
  animals: DataState<Animal>;
  canalUsers: DataState<User>;
  auth: {
    isAuthenticated: boolean;
    uid: string;
  };
}

interface RouteParams {
  id: string;
  canalId: string;
  citySectorId: string;
}

type RootStackParamList = {
  AddCat: undefined;
  CitySectorDetails: undefined;
};

type AddCatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCat"
>;

type CitySectorDetailScreen = StackNavigationProp<RootStackParamList, "CitySectorDetails">;

const EditCanalDetails: React.FC = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AddCatScreenNavigationProp>();
  const navigationCitySector = useNavigation<CitySectorDetailScreen>();

  const { canalId } = route.params as RouteParams;

  const { isAuthenticated, uid } = useSelector(
    (state: RootState) => state.auth
  );
  const { data: canals, status: canalsStatus } = useSelector(
    (state: RootState) => state.canals
  );
  const { data: citiesSector, status: citiesSectorStatus } = useSelector(
    (state: RootState) => state.citiesSector
  );
  const { data: animals, status: animalsStatus } = useSelector(
    (state: RootState) => state.animals
  );
  const { data: users, status: usersStatus } = useSelector(
    (state: RootState) => state.canalUsers
  );

  const canal = canals.find((asso) => asso.id === canalId);

  console.log(canalsStatus)
  useEffect(() => {
    // const canal = canals.find((asso) => asso.id === canalId);
    if (canal) {
      setCurrentCanalName(canal.name);
      setCurrentCanalEmail(canal.email);
      setCurrentCanalCitySector(canal.citySector);
      setCurrentCanalPostalCode(canal.postalCode);
    }
  }, [canals]);

  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [userIsAdmin, setUserRole] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imageUri, setImageUri] = useState(canal?.image);
  const [isEditNameCanalVisible, setEditVisible] = useState(false);
  const [isEditEmailCanalVisible, setEditVisibleEmail] = useState(false);
  const [isEditCitySectorCanalVisible, setEditVisibleCitySector] = useState(false);
  const [isEditPostalCodeCanalVisible, setEditVisiblePostalCode] =
    useState(false);
  const [editedCanalName, setEditedCanalName] = useState("");
  const [editedCanalEmail, setEditedCanalEmail] = useState("");
  const [editedCanalCitySector, setEditedCanalCitySector] = useState("Ville inconnu");
  const [editedCanalPostalCode, setEditedCanalPostalCode] =
    useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [selectRole, setSelectRole] = useState(false);
  const [selectDeassociate, setSelectDeassociate] = useState(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [currentCanalName, setCurrentCanalName] = useState(
    canal.name
  );
  const [currentCanalEmail, setCurrentCanalEmail] = useState(
    canal.email
  );
  const [currentCanalCitySector, setCurrentCanalCitySector] = useState(
    canal.citySector
  );
  const [currentCanalPostalCode, setCurrentCanalPostalCode] =
    useState(canal.citySector);
  const archiveType = "canal";

  const options = [
    { label: "Admin", value: true },
    { label: "Visiteur", value: false },
    // Ajoutez ici d'autres options
  ];

  const [isModified, setIsModified] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Empêche le geste de retour par défaut
      if (!isModified) {
        // Si aucune modification n'a été apportée, laissez l'utilisateur quitter la page.
        return;
      }

      e.preventDefault();

      // Demande confirmation avant de revenir en arrière
      Alert.alert(
        "Annuler les changements ?",
        "Vous avez des données non sauvegardées. Etes vous certain de vouloir quitter ?",
        [
          { text: "Rester", style: "cancel", onPress: () => {} },
          {
            text: "Confirmer",
            style: "destructive",
            // Si l'utilisateur confirme, revenir
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, isModified]);

  const handleConfirm = (value) => {
    setSelectedValue(value);

    // dispatch votre action pour modifier le rôle de l'utilisateur ici
    dispatch(
      changeUserRole({
        userId: selectedUserId, // Convertir l'ID de l'utilisateur en chaîne de caractères
        canalId: canal.id,
        newIsAdmin: value,
      })
    );

    const updatedUsers = users.map((user) => {
      if (user.id === selectedUserId) {
        return { ...user, isAdmin: value === true };
      }
      return user;
    });

    setUpdatedUsers(updatedUsers); // Mettre à jour le state `updatedUsers` avec la liste mise à jour

    // console.log(selectedUserId);
    setSelectedUserId(null); // ferme la modale
    setSelectRole(false);
  };

  const handleClean = () => {
    setSelectedUserId(null);
    setSelectRole(false);
    setSelectDeassociate(false);
  };

  const openDeassociateModal = (userId) => {
    setSelectedUserId(userId);
    setSelectRole(true);
  };

  const openSuppModal = (userId) => {
    setSelectedUserId(userId);
    setSelectDeassociate(true);
  };

  const copyToClipboard = async (value) => {
    await Clipboard.setStringAsync(value);
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleConfirmSuppression = async () => {
    // console.log(id)
    await dispatch(
      removeUserFromCanal({
        userId: selectedUserId,
        canalId: canal.id,
      })
    );
    setConfirmationVisible(false); // Ferme la modale de confirmation
    setAlertMessage("L'utilisateur a été désassocié avec succès"); // Définir le message d'alerte
    setAlertVisible(true); // Affiche la modale d'alerte
    setSelectedUserId(null); // ferme la modale
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      "WixMadeforDisplay-Regular": require("../assets/fonts/WixMadeforDisplay-Regular.ttf"),
      "WixMadeforDisplay-Bold": require("../assets/fonts/WixMadeforDisplay-Bold.otf"), // charge également la variante en gras
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const numSterilizedCats = animals.filter(
    (animal) => animal.isSterilise
  ).length;
  const numNotIdentifiedCats = animals.filter(
    (animal) => !animal.hasIdNumber
  ).length;
  const numIsBelongedCats = animals.filter(
    (animal) => !animal.isBelonged
  ).length;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCanalUsers(canalId));
    }
  }, [canalId, isAuthenticated]);

  useEffect(() => {
    users.forEach((user) => {
      if (user.id === uid) {
        setUserRole(user.isAdmin);
        // console.log(user, user.IsAdmin)
      }
    });
  }, [users]);

  useEffect(() => {
    users.forEach((user) => {
      // if (user.id === uid) {
      // setUserRole(user.isAdmin);
      // }
      console.log(user);
    });
  }, [users]);

  useEffect(() => {
    // loadFonts();
  }, [editedCanalEmail]);

  // useEffect(() => {
  //   if (canalsStatus === 'failed') {
  //     setAlertMessage(canalsStatus.error);
  //     setAlertVisible(true);
  //   } else if (canalsStatus === "succeeded") {
  //     setAlertMessage("La mise à jour a réussi !");
  //     setAlertVisible(true);
  //     console.log('NOOOOn')
  //     // Ensuite, vous pouvez réinitialiser le statut à 'idle' ou autre selon votre logique d'application
  //   }
  // }, [canalsStatus.error, canalsStatus]);


  useEffect(() => {
    setUpdatedUsers(users);
  }, [users]);

  // const handleEditCanalName = async (newName) => {

  // };

  const handleUpdateName = async (newName) => {
    try {
      const updatedData = { name: newName };
      const message = 'Notre nom canal a changé ! Il est désormais ' + newName;
      const userIds = ['oo1qP9CNSYNvgzingDITVJ4XL3a2', 'zcsYehEmnLStL5twOUlP4Ee7FyK2', '4jEvW3mzCqO6GtLt4vHfYZxCHDI3'];
      
      setCurrentCanalName(newName);
      
      await dispatch(updateCanal({ canalId, canalData: updatedData }));
      try {
        await dispatch(createAndSendNotification({ userIds, message }));
    } catch (error) {
        console.error("An error occurred while sending the notification:", error);
        // Vous pouvez également afficher une alerte ou un message d'erreur à l'utilisateur ici si nécessaire.
    }
      
      setEditVisible(false);
    } catch (error) {
      console.error("An error occurred while updating the canal name:", error);
      // Vous pouvez également afficher une alerte ou un message d'erreur à l'utilisateur ici si nécessaire.
    }
  };

  const handleUpdateEmail = (newEmail) => {
    const updatedData = { email: newEmail, name: canal.name }; // Remplacez par le nouvel email
    setCurrentCanalEmail(newEmail);
    dispatch(
      updateCanal({ canalId, canalData: updatedData })
    );
    setEditVisibleEmail(false);
  };

  const handleUpdateCitySector = (newCitySector) => {
    const updatedData = { citySector: newCitySector, name: canal.name }; // Remplacez par la nouvelle ville
    setCurrentCanalCitySector(newCitySector);
    dispatch(
      updateCanal({ canalId, canalData: updatedData })
    );
    setEditVisibleCitySector(false);
  };

  const handleUpdatePostalCode = (newPostalCode) => {
    const updatedData = { postalCode: newPostalCode, name: canal.name }; // Remplacez par le nouveau code postal
    setCurrentCanalPostalCode(newPostalCode);
    dispatch(
      updateCanal({ canalId, canalData: updatedData })
    );
    setEditVisiblePostalCode(false);
  };

  const handleSavePress = async () => {
    if (imageUri !== canal.image) {
      dispatch(updateCanalImage({ canalId, image: imageUri }));
    }
    setIsModified(false);
  };

  return (
    <View style={styles.fold}>
      <HeaderEditAnimal navigation={navigation} animalName={canal.name} />

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.header1st}>
            <EditableImage
              imageUri={imageUri}
              setImageUri={setImageUri}
              isModified={setIsModified}
            />
            <Text style={styles.title} ellipsizeMode='tail' numberOfLines={1} >{canal?.name}</Text>
          </View>
          <View style={styles.sectionShare}>
            <Text style={styles.sectionShare_title}>Partager le canal : </Text>
            <TouchableOpacity
              onPress = {() => {copyToClipboard(canal.id)}}
              style={styles.sectionShare_button}
            >
              <Text style={styles.sectionShare_buttonText} selectable={true} >
                {isCopied ? ('Copié !') : (canal?.id)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.containerSection}>
          {/* Informations generales */}
          <Text style={styles.editUnicalSectionTitle}>Général</Text>
          <View style={styles.containerUnicalSection}>
            <View style={styles.editEltGroup}>
              <Text style={styles.text}>{canal?.name}</Text>
              <TouchableOpacity
                onPress={() => setEditVisible(true)}
                style={styles.sectionHeader}
              >
                <View style={styles.buttonIcon}>
                  <Icon
                    style={styles.buttonIconElt}
                    name="pencil-outline"
                    size={15}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.editEltGroup}>
              <Text style={styles.text}>{canal.email}</Text>
              <TouchableOpacity
                onPress={() => setEditVisibleEmail(true)}
                style={styles.sectionHeader}
              >
                <View style={styles.buttonIcon}>
                  <Icon
                    style={styles.buttonIconElt}
                    name="pencil-outline"
                    size={15}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.editEltGroup}>
              <Text style={styles.text}>{canal?.citySector}</Text>
              <TouchableOpacity
                onPress={() => setEditVisibleCitySector(true)}
                style={styles.sectionHeader}
              >
                <View style={styles.buttonIcon}>
                  <Icon
                    style={styles.buttonIconElt}
                    name="pencil-outline"
                    size={15}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.editEltGroup}>
              <Text style={styles.text}>{canal?.postalCode}</Text>
              <TouchableOpacity
                onPress={() => setEditVisiblePostalCode(true)}
                style={styles.sectionHeader}
              >
                <View style={styles.buttonIcon}>
                  <Icon
                    style={styles.buttonIconElt}
                    name="pencil-outline"
                    size={15}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            </View>

            <TextInputModal
              visible={isEditNameCanalVisible}
              onClose={() => setEditVisible(false)} // Fermeture de la modale
              onConfirm={handleUpdateName}
              messageType={"Entrez le nouveau nom de le canal"}
              onChangeText={setEditedCanalName}
              
            />
            <TextInputModal
              visible={isEditEmailCanalVisible}
              onClose={() => setEditVisibleEmail(false)} // Fermeture de la modale
              onConfirm={handleUpdateEmail}
              messageType={"Entrez le nouvel email"}
              onChangeText={setEditedCanalEmail}
            />
            <TextInputModal
              visible={isEditCitySectorCanalVisible}
              onClose={() => setEditVisibleCitySector(false)} // Fermeture de la modale
              onConfirm={handleUpdateCitySector}
              messageType={"Entrez le nouveau nom de la ville"}
              onChangeText={setEditedCanalCitySector}
            />
            <TextInputModal
              visible={isEditPostalCodeCanalVisible}
              onClose={() => setEditVisiblePostalCode(false)} // Fermeture de la modale
              onConfirm={handleUpdatePostalCode}
              messageType={"Entrez le nouveau postal code"}
              onChangeText={setEditedCanalPostalCode}
            />
            {/* <Text>{canal?.email}</Text>
          <Text>{canal?.citySector}</Text>
          <Text>{canal?.postalCode}</Text> */}
          </View>

          <Text style={styles.editUnicalSectionTitle}>Gestion des membres</Text>
          <View style={styles.containerSection}>
            <View style={styles.section}>
              <View style={styles.members}>
                {updatedUsers.map((user) => (
                  <View style={styles.member} key={user.id}>
                    <View style={{display: 'flex', flexDirection:'column', rowGap: 25, flexWrap: 'wrap', width: 200, flex:1}}>
                      <Text style={styles.text} ellipsizeMode='tail' numberOfLines={1}>
                        {user.surname} {user.name}
                      </Text>
                      <Text style={styles.text} ellipsizeMode='tail' numberOfLines={1}>{user.email}</Text>
                      <Text style={styles.text} ellipsizeMode='tail' numberOfLines={1}>
                        {user.isAdmin ? "Administrateur" : "Visiteur"}
                      </Text>
                    </View>

                    {user.id !== canal.adminId ? (
                      <View style={styles.btnAdmin}>
                        <TouchableOpacity
                          onPress={() => openDeassociateModal(user.id)}
                          style={styles.sectionAdmin_button}
                        >
                          <View style={styles.buttonIcon}>
                            <Icon
                              style={styles.buttonIconElt}
                              name="pencil-outline"
                              size={15}
                              color="#fff"
                            />
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => openSuppModal(user.id)}
                          style={styles.sectionAdmin_button}
                        >
                          <View style={styles.buttonIcon}>
                            <Icon
                              style={styles.buttonIconElt}
                              name="close-outline"
                              size={15}
                              color="#C40030"
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      // <Text style={styles.text}>
                      //   Super Admin, le rôle ne peut être modifié.
                      // </Text>
                      <></>
                    )}
                  </View>
                ))}

                <SelectModal
                  visible={selectRole}
                  // onClose={() => setSelectRole(false)}
                  onClose={handleClean}
                  onConfirm={handleConfirm}
                  options={options}
                />
                <ConfirmationModal
                  visible={selectDeassociate}
                  // onClose={() => setSelectDeassociate(false)}
                  onClose={handleClean}
                  onConfirm={handleConfirmSuppression}
                  messageType={
                    "Voulez-vous vraiment désassocier cet utilisateur de ce canal ?"
                  }
                />
                <CustomAlert
                  visible={isAlertVisible}
                  onClose={() => setAlertVisible(false)}
                  message={alertMessage}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {isModified && (
        <View style={styles.btnSectionSuppSave}>
          <TouchableOpacity onPress={handleSavePress} style={styles.btnSave}>
            <Text style={styles.buttonSaveText}>SAUVEGARDER L'IMAGE</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fold: {
    height: "100%",
  },
  container: {
    padding: 0,
    height: "100%",
  },
  header: {
    flexDirection: "column",
    backgroundColor: "#2F4F4F",
    padding: 30,
  },
  header1st: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#2F4F4F",
    paddingTop: 20,
    columnGap: 20,
  },
  sectionShare: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F4F4F",
    color: "#FFF",
    // padding: 5
  },
  sectionShare_title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFF",
    paddingTop: 5,
    fontFamily: "WixMadeforDisplay-Bold",
  },
  sectionShare_button: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 5,
  },
  sectionShare_buttonText: {
    color: "#000",
  },
  sectionBtns: {
    flexDirection: "row",
    // flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: 40,
    columnGap: 10,
    padding: 6,
    marginTop: 20,
  },
  sectionBtns_btn: {
    flexDirection: "row",
    columnGap: 8,
    backgroundColor: "#000",
    color: "#FFF",
    padding: 10,
    borderRadius: 2,
  },
  sectionBtns_btnText: {
    color: "#FFF",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  subtitle: {
    color: "#2F4F4F",
    fontSize: 22,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },

  containerSection: {
    // padding: 10,
    // backgroundColor: '#C40030',
    // paddingBottom: 25
    height: "100%",
    // paddingBottom: 2
  },

  section: {
    paddingHorizontal: 25,
    paddingBottom: 60,
    // paddingTop: 0,
    backgroundColor: "#2f4f4f",
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "WixMadeforDisplay-Regular",
  },
  editEltGroup: {
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
  },
  buttonGroupIcons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    backgroundColor: "black",
    borderRadius: 2,
    paddingTop: 1,
  },
  buttonIconElt: {
    margin: 7,
  },
  addCat: {
    flexDirection: "column",
    alignItems: "center",
  },
  iconAddCat: {
    flexDirection: "row",
    marginTop: 20,
  },
  sectionCitySector: {
    flexDirection: "column",
    rowGap: 5,
    justifyContent: "center",
  },
  citySectorList: {
    maxWidth: 200,
  },
  sectionBtns_btnCitySector: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#000",
    color: "#FFF",
    padding: 10,
    borderRadius: 2,
  },
  sectionTitleCitySector: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  line: {
    height: 2,
    backgroundColor: "#000", // change this to fit your design
    alignSelf: "center",
    marginVertical: 20, // space above and below the line
    width: "80%", // change this to fit your design
  },
  editUnicalSectionTitle: {
    fontSize: 18,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    textAlign: "left",
    color: "#2F4F4F",
    marginLeft: 15,
  },
  containerUnicalSection: {
    backgroundColor: "#2F4F4F",
    padding: 15,
    rowGap: 20,
  },
  members: {
    marginTop: 20,
    rowGap: 25,
  },
  member: {
    flexDirection: "row",
    justifyContent: "space-between",
    rowGap: 20,
    columnGap: 10,
    paddingBottom: 20,
    borderBottomWidth: 2,
    width: '100%'
    // height: '100%'
  },
  btnAdmin: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sectionAdmin_button: {
    backgroundColor: "transparent",
    padding: 5,
  },
  btnSectionSuppSave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Vous pouvez modifier cette valeur en fonction de vos besoins
    backgroundColor: "#000", // Pour la visibilité
    flexDirection: "row",
    justifyContent: "space-around", // Pour espacer les boutons
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  buttonSaveText: {
    // padding: 20,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: "center",
  },
  buttonSuppText: {
    padding: 20,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: "center",
  },
  btnSave: {
    // backgroundColor: 'green'
    width: "100%",
  },
});

export default EditCanalDetails;
