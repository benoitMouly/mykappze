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
  updateCitySector,
  deleteCitySector,
} from "../features/citiesSector/citySectorSlice";
import {
  fetchAnimalsByCanal,
  fetchAnimalsByCitySector,
  updateAnimalCitySectorName,
} from "../features/animals/animalSlice";
import { fetchCanalUsers } from "../features/citiesSector/canalUsersSlice";
import { useRoute } from "@react-navigation/native";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";
import AnimalList from "../components/animals/animalList";
import AnimalFilters from "../components/animals/animalFilter";
import AddCitySectorModal from "../components/citiesSector/addCitySectorModal";
import AddCat from "./AddCat";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ConfirmationModal from "../components/general/ConfirmationModal";
import TextInputModal from "../components/general/TextUpdateModal";

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
  canalId: string;
  citySectorId: string;
}

type RootStackParamList = {
  AddCat: undefined;
};

type AddCatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCat"
>;

const CitySectorDetails: React.FC = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AddCatScreenNavigationProp>();

  const { citySectorId, canalId } = route.params as RouteParams;

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

  const femaleAnimals = animals.filter((animal) => animal.sex === "Femelle");
  const femaleAnimalsSterilized = femaleAnimals.filter(
    (animal) => animal.isSterilise === true
  );

  const citySector = citiesSector.find(
    (citySector) => citySector.id === citySectorId
  );
  const canal = canals.find((asso) => asso.id === canalId);
  const [activeTab, setActiveTab] = useState("animaux");
  // const citySectorName = citySector.id;

  const [citySectorName, setCitySectorName] = useState(citySector?.name);
  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [userIsAdmin, setUserRole] = useState<boolean>(false);
  const [isOpenBlock1, setIsOpenBlock1] = useState<boolean>(false);
  const [isOpenBlock2, setIsOpenBlock2] = useState<boolean>(false);
  const [isOpenBlock3, setIsOpenBlock3] = useState<boolean>(false);
  const [isOpenBlock4, setIsOpenBlock4] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [editCitySectorMode, setEditCitySectorMode] = useState(false);
  const [editedCitySectorName, setEditedCitySectorName] = useState("");
  const [currentCitySectorName, setCurrentCitySectorName] =
    useState(citySectorName);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [isTextUpdateVisible, setTextUpdateVisible] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isEditVisible, setEditVisible] = useState(false);

  const archiveType = "citySector";

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
  // const sterilizationPercentage = (numSterilizedCats / animals.length) * 100;
  const sterilizationPercentage = Math.round((numSterilizedCats / animals.length) * 100);
  const sterilizationFemalePercentage = Math.round((femaleAnimalsSterilized.length / femaleAnimals.length) * 100);

  // const sterilizationFemalePercentage =
  //   (femaleAnimalsSterilized.length / femaleAnimals.length) * 100;
  // const archiveType = linkedCitySectorId;

  //   useEffect(() => {
  //     if (isAuthenticated) {
  //       dispatch(fetchCities());
  //       // dispatch(fetchAnimalsByCanal(canalId));
  //       dispatch(fetchCanalUsers(canalId));
  //       dispatch(fetchAnimalsByCitySector(citySectorId))
  //     }
  //   }, [dispatch, isAuthenticated]);

  // useEffect(() => {
  //     if (isAuthenticated) {
  //       dispatch(fetchCities());
  //       // dispatch(fetchAnimalsByCanal(canalId));
  //       dispatch(fetchCanalUsers(canalId));
  //       dispatch(fetchAnimalsByCitySector(citySectorId))
  //     }
  //   }, [citySectorId, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAnimalsByCitySector(citySectorId));
      dispatch(fetchCities());
    }
  }, [dispatch, citySectorId, isAuthenticated]);

  useEffect(() => {
    users.forEach((user) => {
      if (user.id === uid) {
        setUserRole(user.isAdmin);
      }
    });
  }, [users]);

  // if (sectorsStatus === 'loading' || animalsStatus === 'loading' || canalsStatus === 'loading' || usersStatus === 'loading' || citiesSectorStatus === 'loading') {
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

  // const handleDeleteCitySector = async(citySectorId) => {

  // }

  const handleDeleteCitySector = async () => {
    // console.log(id);
    if (citySector.id) {
      setConfirmationVisible(true); // Affiche la modale de confirmation
    }
  };

  const handleConfirmSuppression = async () => {
    // console.log(id)
    await dispatch(deleteCitySector(citySector.id));
    setConfirmationVisible(false); // Ferme la modale de confirmation
    setAlertMessage("La ville a été supprimé avec succès"); // Définir le message d'alerte
    setAlertVisible(true); // Affiche la modale d'alerte
  };

  const handleEditCitySector = async (newName) => {
    await dispatch(updateCitySector({ id: citySector.id, name: newName }));
    await dispatch(
      updateAnimalCitySectorName({
        citySectorId: citySector.id,
        newCitySectorName: newName,
      })
    );
    setCurrentCitySectorName(newName); // Update the current citySector name
    console.log("EDIT CITY NAME : ", newName);
    setEditVisible(false);
  };

  return (
    <View>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.header1st}>
            <Text style={styles.labelTitle}>Secteur</Text>
            <Text style={styles.title}>
              {citySector.name ? citySector.name : editedCitySectorName}
            </Text>
          </View>
          {userIsAdmin && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                columnGap: 20,
                // height:
              }}
            >
              <TouchableOpacity
                onPress={() => setEditVisible(true)}
                style={{
                  backgroundColor: "#fff",
                  paddingTop: 13.5,
                  paddingLeft: 13.5,
                  borderRadius: 50,
                  height: 50,
                  width: 50
                }}
              >
                <Icon name="create-outline" size={24} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDeleteCitySector(citySector.id)}
                style={{
                  backgroundColor: "#fff",
                  paddingTop: 13.5,
                  paddingLeft: 13.5,
                  borderRadius: 50,
                  height: 50,
                  width: 50
                }}
              >
                <Icon name="trash-outline" size={24} color="#c40030" />
              </TouchableOpacity>
            </View>
          )}

          <ConfirmationModal
            visible={isConfirmationVisible}
            onClose={() => setConfirmationVisible(false)}
            onConfirm={handleConfirmSuppression}
            messageType={"Voulez-vous vraiment supprimer cette ville ?"}
          />

          <TextInputModal
            visible={isEditVisible}
            onClose={() => setEditVisible(false)} // Fermeture de la modale
            onConfirm={handleEditCitySector}
            messageType={"Entrez le nouveau nom de la ville"}
            onChangeText={setEditedCitySectorName}
          />
        </View>

        {/* <View style={styles.sectionShare}>
          <Text style={styles.sectionShare_title}>Partager le canal : </Text>
          <TouchableOpacity
            onPress={() => handleCopy}
            style={styles.sectionShare_button}
          >
            <Text style={styles.sectionShare_buttonText}>{canal?.id}</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.containerSection}>
          <View style={styles.contentAnimaux}>
            <View style={styles.statAnimal}>
              <View style={styles.dataAnimal}>
                <Text style={styles.dataAnimalText}>{animals.length}</Text>
              </View>
              <View>
                <Text style={styles.labelAnimal}>Chat(s)</Text>
                <Text style={styles.labelAnimalMore}>
                  dont {femaleAnimals.length} femelles répertoriées
                </Text>
              </View>
            </View>
            {numNotIdentifiedCats > 0 ? (
              <View style={styles.statAnimal}>
                <View style={styles.dataAnimal}>
                  <Text style={styles.dataAnimalText}>
                    {numNotIdentifiedCats}
                  </Text>
                </View>
                <View>
                  <Text style={styles.labelAnimal}>Chats non identifiés</Text>
                </View>
              </View>
            ) : (
              <View style={styles.statAnimal}>
                <View
                  style={styles.dataAnimal}
                  // style={{ backgroundColor: "#2f4f4f" }}
                >
                  <Text style={styles.dataAnimalText}>OK</Text>
                </View>
                <View>
                  <Text style={styles.labelAnimal}>
                    Tous les chats sont identifiés.
                  </Text>
                </View>
              </View>
            )}

            {sterilizationFemalePercentage > 0 &&
              (sterilizationFemalePercentage > 75 ? (
                <View style={styles.statAnimal}>
                  <View
                    style={styles.dataAnimalSuccess}
                    // style={{ backgroundColor: "#2f4f4f" }}
                  >
                    <Text style={styles.dataAnimalTextSuccess}>
                      {sterilizationFemalePercentage}%
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.labelAnimal}>
                      Taux de femelles stérilisées
                    </Text>
                    <Text style={styles.labelAnimalMore}>
                      soit un total de {femaleAnimalsSterilized.length} femelles
                      stérilisées / {femaleAnimals.length} répertoriées
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.statAnimal}>
                  <View style={styles.dataAnimal}>
                    <Text style={styles.dataAnimalText}>
                      {sterilizationFemalePercentage}%
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.labelAnimal}>
                      Taux de femelles stérilisées
                    </Text>
                    <Text style={styles.labelAnimalMore}>
                      soit un total de {femaleAnimalsSterilized.length} femelles
                      stérilisées / {femaleAnimals.length} répertoriées
                    </Text>
                  </View>
                </View>
              ))}

            {/* {numSterilizedCats > 0 ? (
              <View style={styles.statAnimal}>
                <View style={styles.dataAnimal}>
                  <Text style={styles.dataAnimalText}>{numSterilizedCats}</Text>
                </View>
                <View>
                  <Text style={styles.labelAnimal}>Chats stérilisés</Text>
                </View>
              </View>
            ) : (
              <View style={styles.statAnimal}>
                <View style={styles.dataAnimalDanger}>
                  <Text style={styles.dataAnimalText}>{numSterilizedCats}</Text>
                </View>
                <View>
                  <Text style={styles.labelAnimal}>Chats stérilisés</Text>
                </View>
              </View>
            )} */}

            {sterilizationPercentage > 75 ? (
              <View style={styles.statAnimal}>
                <View style={styles.dataAnimal}>
                  <Text style={styles.dataAnimalText}>
                    {sterilizationPercentage}%
                  </Text>
                </View>
                <View>
                  <Text style={styles.labelAnimal}>
                    Taux de stérilisation global
                  </Text>
                  <Text style={styles.labelAnimal}>{numSterilizedCats} / {animals.length} chats</Text>
                </View>
              </View>
            ) : (
              <View style={styles.statAnimal}>
                <View
                  style={styles.dataAnimalDanger}
                  // style={{ borderColor: "#872929" }}
                >
                  <Text style={styles.dataAnimalText}>
                    {sterilizationPercentage}%
                  </Text>
                </View>
                <View>
                  <Text style={styles.labelAnimal}>
                    Taux de stérilisation global
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* <View style={styles.line} /> */}

        <View style={{ backgroundColor: "#2f4f4f" }}>
          <AnimalFilters animals={animals} archiveType={archiveType} />
        </View>
      </ScrollView>
      {userIsAdmin && (
        <View style={styles.footer}>
          <AddCitySectorModal
            style={styles.sectionBtns_btn}
            canalId={canal?.id}
          />
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={styles.menuButton}
            >
              <Image
                source={require("../assets/kappze_logo_circle_noir_roigne.png")}
                style={styles.logo}
              />
            </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddCat", { canalId: canal?.id })
            }
            style={styles.sectionBtns_btn}
          >

            <View style={styles.buttonGroupIcons}>
              <Image
                source={require("../assets/icon-paw.png")}
                style={styles.buttonIcon}
              />
              <Text style={{ color: "#ddd" }}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    // padding: 20,
    height: "100%",
    backgroundColor: '#2f4f4f'
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#2F4F4F",
    padding: 30,
    paddingBottom: 10,

    justifyContent: "space-between",
    // height: 80
  },
  header1st: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 20,
    backgroundColor: "#2F4F4F",
    paddingTop: 0,
  },
  btnAdmin: {
    color: "#fff",
  },
  sectionShare: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F4F4F",
    color: "#FFF",
    paddingBottom: 10
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
    // backgroundColor: "#000",
    color: "#ddd",
    padding: 10,
    borderRadius: 2,
  },
  sectionBtns_btnText: {
    color: "#ddd",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
  },
  labelTitle: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "WixMadeforDisplay-Regular",
    fontWeight: "600",
    marginBottom: 10,
  },
  title: {
    color: "#FFF",
    fontSize: 22,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },

  containerSection: {
    padding: 10,
    // backgroundColor: '#ddd'
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
    width: 25,
    height: 25,
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
  sectionCitySector: {
    flexDirection: "column",
    rowGap: 5,
    // alignItems: 'center',
    justifyContent: "center",
  },
  citySectorList: {
    maxWidth: 200,
    // backgroundColor: 'blue'
  },
  sectionBtns_btnCitySector: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
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
  footer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Vous pouvez modifier cette valeur en fonction de vos besoins
    backgroundColor: "#122121", // Pour la visibilité
    flexDirection: "row",
    justifyContent: "space-around", // Pour espacer les boutons
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
  },
  tabs: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-around",
    backgroundColor: "#2f4f4f",
  },
  labeltabs: {
    backgroundColor: "#2f4f4f",
    borderRadius: 2,
  },
  tab: {
    fontSize: 16,
    fontFamily: "WixMadeforDisplay-Regular",
    fontWeight: "600",
    padding: 10,
    backgroundColor: "#2f4f4f",
    color: "#fff",
    borderRadius: 2,
  },
  activeTab: {
    backgroundColor: "rgb(242,242,242)",
    fontSize: 16,
    fontFamily: "WixMadeforDisplay-Regular",
    fontWeight: "600",
    padding: 10,
    color: "#2f4f4f",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  tabsContent: {
    padding: 0,
    backgroundColor: "rgb(242,242,242)",
  },
  contentAnimaux: {
    display: "flex", // implicitement défini pour tous les éléments React Native
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start", // centré verticalement
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: '#ddd'
    // columnGap: 20
  },
  contentSecteurs: {
    padding: 10,
  },
  statAnimal: {
    width: "48%", // moins que 50% pour tenir compte de justifyContent: 'space-between'
    marginVertical: 5, // pour simuler rowGap
    display: "flex",
    flexDirection: "column",
    rowGap: 5,
    justifyContent: "flex-start",
    alignItems: "center",
    maxWidth: 200,
  },
  dataAnimal: {
    alignItems: "center",
    justifyContent: "center",
    width: 60, // Largeur fixe pour un cercle parfait
    height: 60, // Hauteur fixe pour un cercle parfait
    borderWidth: 4, // Largeur de la bordure
    borderColor: "#2f4f4f", // Couleur de la bordure
    borderRadius: 30, // Rayon pour un cercle parfait (la moitié de la largeur/hauteur)
    backgroundColor: "transparent", // Fond transparent
    marginTop: 10,
    fontFamily: "WixMadeforDisplay-Regular",
  },
  dataAnimalSuccess: {
    alignItems: "center",
    justifyContent: "center",
    width: 60, // Largeur fixe pour un cercle parfait
    height: 60, // Hauteur fixe pour un cercle parfait
    borderWidth: 4, // Largeur de la bordure
    borderColor: "#2f4f4f", // Couleur de la bordure
    borderRadius: 30, // Rayon pour un cercle parfait (la moitié de la largeur/hauteur)
    backgroundColor: "#2f4f4f", // Fond transparent
    marginTop: 10,
  },
  dataAnimalDanger: {
    alignItems: "center",
    justifyContent: "center",
    width: 60, // Largeur fixe pour un cercle parfait
    height: 60, // Hauteur fixe pour un cercle parfait
    borderWidth: 4, // Largeur de la bordure
    borderColor: "#872929", // Couleur de la bordure
    borderRadius: 30, // Rayon pour un cercle parfait (la moitié de la largeur/hauteur)
    backgroundColor: "transparent", // Fond transparent
    marginTop: 10,
  },
  dataAnimalText: {
    fontWeight: "bold",
    fontFamily: "WixMadeforDisplay-Regular",
  },
  dataAnimalTextSuccess: {
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "WixMadeforDisplay-Regular",
  },
  labelAnimal: {
    textAlign: "center",
    fontFamily: "WixMadeforDisplay-Regular",
    fontSize: 14,
  },
  labelAnimalMore: {
    fontSize: 12,
    textAlign: "center",
    // flex: 1,
    flexWrap: "wrap",
    fontFamily: "WixMadeforDisplay-Regular",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 60,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default CitySectorDetails;
