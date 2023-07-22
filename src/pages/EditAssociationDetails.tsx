import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { fetchCities, fetchAllSectors } from "../features/cities/citySlice";
import { fetchAnimalsByAssociation } from "../features/animals/animalSlice";
import { fetchSectorById } from "../features/sectors/sectorSlice";
import {
  fetchAssociationUsers,
  removeUserFromAssociation,
} from "../features/associations/associationUsersSlice";
import { useRoute } from "@react-navigation/native";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";
import AnimalList from "../components/animals/animalList";
import AnimalFilters from "../components/animals/animalFilter";
import { fetchSectors } from "../features/sectors/sectorSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import EditableImage from "../components/general/EditableImage";
import TextInputModal from "../components/general/TextUpdateModal";
import {
  changeUserRole,
  updateAssociation,
} from "../features/associations/associationSlice";
import SelectModal from "../components/general/EditableSelect";
import ConfirmationModal from "../components/general/ConfirmationModal";
import CustomAlert from "../components/general/CustomAlert";

// définir les interfaces
interface Association {
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

interface City {
  // Propriétés pour la ville...
}

interface Sector {
  // Propriétés pour le secteur...
}

interface DataState<T> {
  data: T[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  // Ajoutez ici d'autres champs si nécessaire
}

// Utilisez cette interface dans l'interface RootState
interface RootState {
  associations: DataState<Association>;
  cities: DataState<City>;
  animals: DataState<Animal>;
  associationUsers: DataState<User>;
  sectors: DataState<Sector>;
  auth: {
    isAuthenticated: boolean;
    uid: string;
  };
}

interface RouteParams {
  id: string;
  associationId: string;
  cityId: string;
}

type RootStackParamList = {
  AddCat: undefined;
  CityDetails: undefined;
};

type AddCatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCat"
>;

type CityDetailScreen = StackNavigationProp<RootStackParamList, "CityDetails">;

const EditAssociationDetails: React.FC = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AddCatScreenNavigationProp>();
  const navigationCity = useNavigation<CityDetailScreen>();

  const { associationId } = route.params as RouteParams;

  const { isAuthenticated, uid } = useSelector(
    (state: RootState) => state.auth
  );
  const { data: associations, status: associationsStatus } = useSelector(
    (state: RootState) => state.associations
  );
  const { data: cities, status: citiesStatus } = useSelector(
    (state: RootState) => state.cities
  );
  const { data: animals, status: animalsStatus } = useSelector(
    (state: RootState) => state.animals
  );
  const { data: users, status: usersStatus } = useSelector(
    (state: RootState) => state.associationUsers
  );

  const association = associations.find((asso) => asso.id === associationId);

  useEffect(() => {
    // const association = associations.find((asso) => asso.id === associationId);
    if (association) {
      setCurrentAssociationName(association.name);
      setCurrentAssociationEmail(association.email);
      setCurrentAssociationCity(association.city);
      setCurrentAssociationPostalCode(association.postalCode);
    }
  }, [associations]);

  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [userIsAdmin, setUserRole] = useState<boolean>(false);
  const [sectorsList, setSectors] = useState<Sector[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [isEditNameAssociationVisible, setEditVisible] = useState(false);
  const [isEditEmailAssociationVisible, setEditVisibleEmail] = useState(false);
  const [isEditCityAssociationVisible, setEditVisibleCity] = useState(false);
  const [isEditPostalCodeAssociationVisible, setEditVisiblePostalCode] =
    useState(false);
  const [editedAssociationName, setEditedAssociationName] = useState("");
  const [editedAssociationEmail, setEditedAssociationEmail] = useState("");
  const [editedAssociationCity, setEditedAssociationCity] = useState("");
  const [editedAssociationPostalCode, setEditedAssociationPostalCode] =
    useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);

  const [currentAssociationName, setCurrentAssociationName] = useState(
    association.name
  );
  const [currentAssociationEmail, setCurrentAssociationEmail] = useState(
    association.email
  );
  const [currentAssociationCity, setCurrentAssociationCity] = useState(
    association.city
  );
  const [currentAssociationPostalCode, setCurrentAssociationPostalCode] =
    useState(association.city);
  const archiveType = "association";

  const options = [
    { label: "Admin", value: true },
    { label: "Visiteur", value: false },
    // Ajoutez ici d'autres options
  ];

  const handleConfirm = (value) => {
    setSelectedValue(value);

    // dispatch votre action pour modifier le rôle de l'utilisateur ici
    dispatch(
      changeUserRole({
        userId: selectedUserId, // Convertir l'ID de l'utilisateur en chaîne de caractères
        associationId: association.id,
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
  };

  const openModal = (userId) => {
    setSelectedUserId(userId);
  };

  const handleDeassociateUser = async () => {
    // console.log(id);
    if (animal.id) {
      setConfirmationVisible(true); // Affiche la modale de confirmation
    }
  };

  const handleConfirmSuppression = async () => {
    // console.log(id)
    await dispatch(
      removeUserFromAssociation({
        userId: selectedUserId,
        associationId: association.id,
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
      dispatch(fetchAssociationUsers(associationId));
    }
  }, [associationId, isAuthenticated]);

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
  }, [editedAssociationEmail]);

  useEffect(() => {
    setUpdatedUsers(users);
  }, [users]);

  // const handleEditAssociationName = async (newName) => {

  // };

  const handleUpdateName = (newName) => {
    const updatedData = { name: newName };
    setCurrentAssociationName(newName);
    dispatch(
      updateAssociation({ associationId, associationData: updatedData })
    );
    setEditVisible(false);
  };

  const handleUpdateEmail = (newEmail) => {
    const updatedData = { email: newEmail, name: association.name }; // Remplacez par le nouvel email
    setCurrentAssociationEmail(newEmail);
    dispatch(
      updateAssociation({ associationId, associationData: updatedData })
    );
    setEditVisibleEmail(false);
  };

  const handleUpdateCity = (newCity) => {
    const updatedData = { city: newCity, name: association.name }; // Remplacez par la nouvelle ville
    setCurrentAssociationCity(newCity);
    dispatch(
      updateAssociation({ associationId, associationData: updatedData })
    );
    setEditVisibleCity(false);
  };

  const handleUpdatePostalCode = (newPostalCode) => {
    const updatedData = { postalCode: newPostalCode, name: association.name }; // Remplacez par le nouveau code postal
    setCurrentAssociationPostalCode(newPostalCode);
    dispatch(
      updateAssociation({ associationId, associationData: updatedData })
    );
    setEditVisiblePostalCode(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header1st}>
          <Image source={{ uri: association?.image }} style={styles.image} />
          <Text style={styles.title}>{association?.name}</Text>
        </View>
        <View style={styles.sectionShare}>
          <Text style={styles.sectionShare_title}>Partager le canal : </Text>
          <TouchableOpacity
            onPress={() => handleCopy}
            style={styles.sectionShare_button}
          >
            <Text style={styles.sectionShare_buttonText}>
              {association?.id}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.containerSection}>
        {/* Informations generales */}
        <View style={styles.section}>
          <View>
            <Text>{association?.name}</Text>
            <TouchableOpacity
              onPress={() => setEditVisible(true)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>{association.email}</Text>
            <TouchableOpacity
              onPress={() => setEditVisibleEmail(true)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>{association?.city}</Text>
            <TouchableOpacity
              onPress={() => setEditVisibleCity(true)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>{association?.postalCode}</Text>
            <TouchableOpacity
              onPress={() => setEditVisiblePostalCode(true)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Modifier</Text>
            </TouchableOpacity>
          </View>

          <TextInputModal
            visible={isEditNameAssociationVisible}
            onClose={() => setEditVisible(false)} // Fermeture de la modale
            onConfirm={handleUpdateName}
            messageType={"Entrez le nouveau nom de l'association"}
            onChangeText={setEditedAssociationName}
          />
          <TextInputModal
            visible={isEditEmailAssociationVisible}
            onClose={() => setEditVisibleEmail(false)} // Fermeture de la modale
            onConfirm={handleUpdateEmail}
            messageType={"Entrez le nouvel email"}
            onChangeText={setEditedAssociationEmail}
          />
          <TextInputModal
            visible={isEditCityAssociationVisible}
            onClose={() => setEditVisibleCity(false)} // Fermeture de la modale
            onConfirm={handleUpdateCity}
            messageType={"Entrez le nouveau nom de la ville"}
            onChangeText={setEditedAssociationCity}
          />
          <TextInputModal
            visible={isEditPostalCodeAssociationVisible}
            onClose={() => setEditVisiblePostalCode(false)} // Fermeture de la modale
            onConfirm={handleUpdatePostalCode}
            messageType={"Entrez le nouveau postal code"}
            onChangeText={setEditedAssociationPostalCode}
          />
          {/* <Text>{association?.email}</Text>
          <Text>{association?.city}</Text>
          <Text>{association?.postalCode}</Text> */}
          <EditableImage imageUri={imageUri} setImageUri={setImageUri} />
        </View>

        <View style={styles.section}>
          {users.map((user, index) => (
            <View key={index}>
              <Text>{user.name}</Text>
              <Text>{user.email}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text>Gestion des membres : </Text>
          <View>
            {updatedUsers.map((user) => (
              <View key={user.id}>
                <Text>
                  {user.surname} {user.name}, {user.email}
                </Text>
                <Text>{user.isAdmin ? "Administrateur" : "Visiteur"}</Text>

                {user.id !== association.adminId ? (
                  <>
                    <TouchableOpacity
                      onPress={() => openModal(user.id)}
                      style={styles.sectionShare_button}
                    >
                      <Text style={styles.sectionShare_buttonText}>
                        Modifier le rôle
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => openModal(user.id)}
                      style={styles.sectionShare_button}
                    >
                      <Text style={styles.sectionShare_buttonText}>
                        Retirer ce membre de l'association
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text>Super Admin, le rôle ne peut être modifié.</Text>
                )}
              </View>
            ))}

            <SelectModal
              visible={selectedUserId !== null}
              onClose={() => setSelectedUserId(null)}
              onConfirm={handleConfirm}
              options={options}
            />
            <ConfirmationModal
              visible={selectedUserId !== null}
              onClose={() => setSelectedUserId(null)}
              onConfirm={handleConfirmSuppression}
              messageType={
                "Voulez-vous vraiment désassocier cet utilisateur de l'association ?"
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

      <View style={styles.line} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

  containerSection: {
    padding: 10,
    // backgroundColor: '#C40030',
    // margin: 5
  },

  section: {
    marginBottom: 20,
    padding: 25,
    paddingTop: 0,
    // borderWidth: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 25,
    paddingBottom: 5,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
  buttonGroupIcons: {
    display: "flex",
    flexDirection: "row",
  },
  buttonIcon: {
    marginRight: 5,
    width: 15,
    height: 15,
  },
  addCat: {
    flexDirection: "column",
    // justifyContent: 'center',
    alignItems: "center",
    // width: '100%'
  },
  iconAddCat: {
    flexDirection: "row",
    marginTop: 20,
  },
  sectionCity: {
    flexDirection: "column",
    rowGap: 5,
    // alignItems: 'center',
    justifyContent: "center",
  },
  cityList: {
    maxWidth: 200,
    // backgroundColor: 'blue'
  },
  sectionBtns_btnCity: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#000",
    color: "#FFF",
    padding: 10,
    borderRadius: 2,
  },
  sectionTitleCity: {
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
});

export default EditAssociationDetails;
