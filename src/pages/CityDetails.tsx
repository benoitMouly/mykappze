import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Touchable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import {
  fetchCities,
  fetchAllSectors,
  updateCity,
  deleteCity,
} from "../features/cities/citySlice";
import {
  fetchAnimalsByAssociation,
  fetchAnimalsByCity,
  updateAnimalCityName,
} from "../features/animals/animalSlice";
import { fetchSectorById } from "../features/sectors/sectorSlice";
import { fetchAssociationUsers } from "../features/associations/associationUsersSlice";
import { useRoute } from "@react-navigation/native";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";
import AnimalList from "../components/animals/animalList";
import AnimalFilters from "../components/animals/animalFilter";
import AddCityModal from "../components/cities/addCityModal";
import AddSectorModal from "../components/sectors/addSectorModal";
import AddCat from "./AddCat";
import { fetchSectors } from "../features/sectors/sectorSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ConfirmationModal from "../components/general/ConfirmationModal";
import TextInputModal from "../components/general/TextUpdateModal";

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
  associationId: string;
  cityId: string;
  sectorId: string;
}

type RootStackParamList = {
  AddCat: undefined;
};

type AddCatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCat"
>;

type SectorDetailScreen = StackNavigationProp<
  RootStackParamList,
  "SectorDetails"
>;

const CityDetails: React.FC = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AddCatScreenNavigationProp>();
  const navigationCity = useNavigation<SectorDetailScreen>();

  const { cityId, associationId } = route.params as RouteParams;

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
  const { data: sectors, status: sectorsStatus } = useSelector(
    (state: RootState) => state.sectors
  );

  const city = cities.find((city) => city.id === cityId);
  const association = associations.find((asso) => asso.id === associationId);
  // const cityName = city.id;

  const [cityName, setCityName] = useState(city?.name);
  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [userIsAdmin, setUserRole] = useState<boolean>(false);
  const [isOpenBlock1, setIsOpenBlock1] = useState<boolean>(true);
  const [isOpenBlock2, setIsOpenBlock2] = useState<boolean>(false);
  const [isOpenBlock3, setIsOpenBlock3] = useState<boolean>(false);
  const [isOpenBlock4, setIsOpenBlock4] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [sectorsList, setSectors] = useState<Sector[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [editCityMode, setEditCityMode] = useState(false);
  const [editedCityName, setEditedCityName] = useState("");
  const [currentCityName, setCurrentCityName] = useState(cityName);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [isTextUpdateVisible, setTextUpdateVisible] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isEditVisible, setEditVisible] = useState(false);

  const archiveType = "city";

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

  //   useEffect(() => {
  //     dispatch(fetchSectors(cityId));
  //   }, [isAuthenticated]);

  const numSterilizedCats = animals.filter(
    (animal) => animal.isSterilise
  ).length;
  const numNotIdentifiedCats = animals.filter(
    (animal) => !animal.hasIdNumber
  ).length;
  const numIsBelongedCats = animals.filter(
    (animal) => !animal.isBelonged
  ).length;
  // const archiveType = linkedCityId;

  //   useEffect(() => {
  //     if (isAuthenticated) {
  //       dispatch(fetchCities());
  //       // dispatch(fetchAnimalsByAssociation(associationId));
  //       dispatch(fetchAssociationUsers(associationId));
  //       dispatch(fetchAnimalsByCity(cityId))
  //     }
  //   }, [dispatch, isAuthenticated]);

  // useEffect(() => {
  //     if (isAuthenticated) {
  //       dispatch(fetchCities());
  //       // dispatch(fetchAnimalsByAssociation(associationId));
  //       dispatch(fetchAssociationUsers(associationId));
  //       dispatch(fetchAnimalsByCity(cityId))
  //     }
  //   }, [cityId, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSectors(cityId));
      dispatch(fetchAnimalsByCity(cityId));
      dispatch(fetchCities());
    }
  }, [dispatch, cityId, isAuthenticated]);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       if (isAuthenticated) {
  //         // console.log(association)
  //         const sectores = await fetchAllSectors(cities, dispatch);
  //         setSectors(sectores);
  //       }
  //     };

  //     // fetchData();
  //   }, [association, cities, isAuthenticated]);

  useEffect(() => {
    users.forEach((user) => {
      if (user.id === uid) {
        setUserRole(user.isAdmin);
      }
    });
  }, [users]);

  // if (sectorsStatus === 'loading' || animalsStatus === 'loading' || associationsStatus === 'loading' || usersStatus === 'loading' || citiesStatus === 'loading') {
  //     return <LoadingPage />;
  // }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Réinitialiser après 2 secondes
    } catch (err) {
      console.error("Erreur de copie", err);
    }
  };

  // const handleDeleteCity = async(cityId) => {

  // }

  const handleDeleteCity = async () => {
    // console.log(id);
    if (city.id) {
      setConfirmationVisible(true); // Affiche la modale de confirmation
    }
  };

  const handleConfirmSuppression = async () => {
    // console.log(id)
    await dispatch(deleteCity(city.id));
    setConfirmationVisible(false); // Ferme la modale de confirmation
    setAlertMessage("La ville a été supprimé avec succès"); // Définir le message d'alerte
    setAlertVisible(true); // Affiche la modale d'alerte
  };

  const handleEditCity = async (newName) => {
    await dispatch(updateCity({ id: city.id, name: newName }));
    await dispatch(
      updateAnimalCityName({ cityId: city.id, newCityName: newName })
    );
    setCurrentCityName(newName); // Update the current city name
    console.log("EDIT CITY NAME : ", newName);
    setEditVisible(false);
  };

  return (
    <View>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      {userIsAdmin && (
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', columnGap: 20}}>

            <TouchableOpacity onPress={() => setEditVisible(true)} style={{backgroundColor: '#fff', padding: 5, borderRadius: 50}}>
                  <Icon name="create-outline" size={24} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity  onPress={() => handleDeleteCity(city.id)} style={{backgroundColor: '#fff', padding: 5, borderRadius: 50}}>
            <Icon name="trash-outline" size={24} color="#c40030" />
          </TouchableOpacity>

          </View>
        )}
        <View style={styles.header1st}>
          <Text style={styles.title}>
            Ville de : {city.name ? city.name : editedCityName}
          </Text>
        </View>
        <ConfirmationModal
          visible={isConfirmationVisible}
          onClose={() => setConfirmationVisible(false)}
          onConfirm={handleConfirmSuppression}
          messageType={"Voulez-vous vraiment supprimer cette ville ?"}
        />

        <TextInputModal
          visible={isEditVisible}
          onClose={() => setEditVisible(false)} // Fermeture de la modale
          onConfirm={handleEditCity}
          messageType={"Entrez le nouveau nom de la ville"}
          onChangeText={setEditedCityName}
        />

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

        {/* <View style={styles.sectionBtns}>
          {userIsAdmin && (
            <>
              <AddSectorModal
                style={styles.sectionBtns_btn}
                associationId={association?.id}
              />
            </>
          )}

 
        </View>

        <View style={styles.addCat}>
          <View style={styles.iconAddCat}>
            {userIsAdmin && (
              <>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AddCat", {
                      associationId: association?.id,
                    })
                  }
                  style={styles.sectionBtns_btn}
                >
                  <Text style={styles.sectionBtns_btnText}>
                    Ajouter un chat
                  </Text>
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
              </>
            )}
          </View>
        </View> */}
      </View>

      <View style={styles.containerSection}>
        <TouchableOpacity
          onPress={() => setIsOpenBlock1(!isOpenBlock1)}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Secteurs</Text>
          <Icon
            name={isOpenBlock1 ? "chevron-down" : "chevron-forward"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
        {isOpenBlock1 && (
          <View style={styles.sectionCity}>
            {sectors.map((sector) => (
              <View style={styles.cityList} key={sector.id}>
                <TouchableOpacity
                  onPress={() =>
                    navigationCity.navigate("SectorDetails", {
                      associationId: associationId,
                      cityId: city?.id,
                      sectorId: sector?.id,
                    })
                  }
                  style={styles.sectionBtns_btnCity}
                >
                  <Text style={styles.sectionTitleCity}>{sector?.name}</Text>
                  <Icon name={"chevron-forward"} size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => setIsOpenBlock2(!isOpenBlock2)}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Animaux : ({users.length})</Text>
          <Icon
            name={isOpenBlock2 ? "chevron-down" : "chevron-forward"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
        {isOpenBlock2 && (
          <View style={styles.section}>
            {users.map((user) => (
              <View key={user.id}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
              </View>
            ))}
          </View>
        )}
      </View>


      <View style={styles.line} />

      <AnimalFilters
        animals={animals}
        archiveType={archiveType}
        sectorized={sectorsList}
      />



    </ScrollView>
    {userIsAdmin && (
      <View style={styles.footer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AddCat", { associationId: association?.id })
        }
        style={styles.sectionBtns_btn}
      >
        <View style={styles.buttonGroupIcons}>
          <Image
            source={require("../assets/icon-paw.png")}
            style={styles.buttonIcon}
          />
          <Text style={{ color: "white" }}>+</Text>
        </View>
      </TouchableOpacity>
      <AddSectorModal
        style={styles.sectionBtns_btn}
        associationId={association?.id}
      />
    </View>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    heigt: "100%",
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
  btnAdmin: {
    color: '#fff'
  },
  sectionShare: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F4F4F",
    color: "#FFF",
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
    // color: '#FFF'
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
  footer: {
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
});

export default CityDetails;
