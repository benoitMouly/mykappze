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
  Button,
  RefreshControl,
} from "react-native";
// import Clipboard from '@react-native-clipboard/clipboard';

import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { fetchCities } from "../features/citiesSector/citySectorSlice";
import { fetchAnimalsByCanal } from "../features/animals/animalSlice";
import { fetchCanalUsers } from "../features/canals/canalUsersSlice";
import { useRoute } from "@react-navigation/native";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";
import AnimalList from "../components/animals/animalList";
import AnimalFilters from "../components/animals/animalFilter";
import AddCitySectorModal from "../components/citiesSector/addCitySectorModal";
import AddCat from "./AddCat";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Clipboard from "expo-clipboard";

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
  EditCanal: undefined;
};

type AddCatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCat"
>;

type CitySectorDetailScreen = StackNavigationProp<
  RootStackParamList,
  "CitySectorDetails"
>;

type EditCanalScreen = StackNavigationProp<RootStackParamList, "EditCanal">;

const CanalDetails: React.FC = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AddCatScreenNavigationProp>();
  const navigationCitySector = useNavigation<CitySectorDetailScreen>();
  const navigationEdit = useNavigation<EditCanalScreen>();
  const [copiedText, setCopiedText] = useState("");

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

  const femaleAnimals = animals.filter((animal) => animal.sex === "Femelle");
  const femaleAnimalsSterilized = femaleAnimals.filter(
    (animal) => animal.isSterilise === true
  );

  const canal = canals.find((asso) => asso.id === canalId);
  const [activeTab, setActiveTab] = useState("animaux");

  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [userIsAdmin, setUserRole] = useState<boolean>(false);
  const [isOpenBlock1, setIsOpenBlock1] = useState<boolean>(false);
  const [isOpenBlock2, setIsOpenBlock2] = useState<boolean>(false);
  const [isOpenBlock3, setIsOpenBlock3] = useState<boolean>(false);
  const [isOpenBlock4, setIsOpenBlock4] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const archiveType = "canal";

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

  useEffect(() => {
    // Initialiser userRoles avec les rôles actuels des utilisateurs
    users.forEach((user) => {
      if (user.id === uid) {
        setUserRole(user.isAdmin);
      }
    });
  }, [users]);

  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler une requête de réseau
    wait(2000).then(() => {
      setRefreshing(false), dispatch(fetchAnimalsByCanal(canalId));
    });
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
  const sterilizationPercentage = (numSterilizedCats / animals.length) * 100;
  const sterilizationFemalePercentage =
    (femaleAnimalsSterilized.length / femaleAnimals.length) * 100;
  // const archiveType = linkedCitySectorId;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCities(canalId));
      dispatch(fetchAnimalsByCanal(canalId));
      dispatch(fetchCanalUsers(canalId));
    }
  }, [canalId, isAuthenticated]);

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

  const copyToClipboard = async (value) => {
    await Clipboard.setStringAsync(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <View style={{ backgroundColor: "#2f4f4f" }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            progressViewOffset={85}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.header1st}>
            <View>
              {canal.image ? (
                <Image style={styles.image} source={{ uri: canal.image }} />
              ) : (
                <Image
                  style={styles.image}
                  source={require("../assets/kappze_logo_without_square_bw.png")}
                />
              )}
            </View>
            <View>
              <Text style={styles.title}>{canal?.name}</Text>
            </View>

            <View style={styles.settingsBtn}>
              {userIsAdmin && (
                <TouchableOpacity
                  onPress={() =>
                    navigationEdit.navigate("EditCanal", {
                      canalId: canal?.id,
                    })
                  }
                  style={{
                    backgroundColor: "#fff",
                    padding: 5,
                    borderRadius: 50,
                  }}
                >
                  <Icon name={"settings-outline"} size={24} color="#000" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.sectionShare}>
            <Text style={styles.sectionShare_title}>Partager le canal : </Text>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(canal.id);
              }}
              style={styles.sectionShare_button}
            >
              <Text style={styles.sectionShare_buttonText} selectable={true}>
                {isCopied ? "Copié !" : canal?.id}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addCat}>
            <View style={styles.iconAddCat}></View>
          </View>
        </View>

        <View />

        <View style={styles.module}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={styles.labeltabs}
              onPress={() => setActiveTab("animaux")}
            >
              <Text
                style={activeTab === "animaux" ? styles.activeTab : styles.tab}
              >
                Animaux
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.labeltabs}
              onPress={() => setActiveTab("secteurs")}
            >
              <Text
                style={activeTab === "secteurs" ? styles.activeTab : styles.tab}
              >
                Secteurs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.labeltabs}
              onPress={() => setActiveTab("informations")}
            >
              <Text
                style={
                  activeTab === "informations" ? styles.activeTab : styles.tab
                }
              >
                Informations
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.tabsContent}>
              {activeTab === "animaux" && (
                <View style={styles.contentAnimaux}>
                  <View style={styles.statAnimal}>
                    <View style={styles.dataAnimal}>
                      <Text style={styles.dataAnimalText}>
                        {animals.length}
                      </Text>
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
                        <Text style={styles.labelAnimal}>
                          Chats non identifiés
                        </Text>
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
                            soit un total de {femaleAnimalsSterilized.length}{" "}
                            femelles stérilisées / {femaleAnimals.length}{" "}
                            répertoriées
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
                            soit un total de {femaleAnimalsSterilized.length}{" "}
                            femelles stérilisées / {femaleAnimals.length}{" "}
                            répertoriées
                          </Text>
                        </View>
                      </View>
                    ))}

                  {sterilizationPercentage > 75 ? (
                    <View style={styles.statAnimal}>
                      <View style={styles.dataAnimal}>
                        <Text style={{ color: "#000" }}>
                          {sterilizationPercentage}%
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.labelAnimal}>
                          Taux de stérilisation global
                        </Text>
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
              )}

              {activeTab === "secteurs" && (
                <View style={styles.sectionCitySector}>
                  {citiesSector.map((citySector) => (
                    <View style={styles.citySectorList} key={citySector.id}>
                      <TouchableOpacity
                        onPress={() =>
                          navigationCitySector.navigate("CitySectorDetails", {
                            canalId: canalId,
                            citySectorId: citySector?.id,
                          })
                        }
                        style={styles.sectionBtns_btnCitySector}
                      >
                        <Text style={styles.sectionTitleCitySector}>
                          {citySector?.name}
                        </Text>
                        <Icon
                          name={"chevron-forward"}
                          size={24}
                          color="#2f4f4f"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {activeTab === "informations" && (
                <View style={styles.sectionInformations}>
                  <View>
                    <Text style={styles.generalInfoLabel}>{canal?.name}</Text>
                    <Text style={styles.generalInfoLabel}>{canal?.email}</Text>
                    <Text style={styles.generalInfoLabel}>
                      {canal?.citySector ? canal.citySector : "Ville indéfinie"}
                      , {canal?.postalCode}
                    </Text>
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <Text style={styles.generalInfoMembersTitle}>
                      Membres ({users.length})
                    </Text>
                    {users.map((user) => (
                      <View style={styles.generalInfoMemberElt} key={user.id}>
                        <View>
                          <Text style={styles.generalInfoMemberText}>
                            {user.name} {user.surname}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 5,
                          }}
                        >
                          <Icon name={"mail-outline"} size={14} color="#000" />

                          <Text style={styles.generalInfoMemberText}>
                            {user.email}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
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
              <Text style={{ color: "white" }}>+</Text>
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
    paddingBottom: 50,
    height: "100%",
    backgroundColor: "#2f4f4f",
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
    // padding: 5,
    width: "55%",
  },
  sectionShare_buttonText: {
    color: "#000",
    fontFamily: "WixMadeforDisplay-Regular",
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
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
    // backgroundColor: "#000",
    color: "#FFF",
    padding: 10,
    borderRadius: 2,
    // borderWidth: 2,
    // borderColor: '#fff'
  },
  sectionBtns_btnSettings: {
    flexDirection: "row",
    columnGap: 8,
    backgroundColor: "transparent",
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
    padding: 30,
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
    flexDirection: "row",
    rowGap: 5,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 5,
    marginVertical: 40,
  },
  citySectorList: {
    maxWidth: 150,
    marginBottom: 15,
    // backgroundColor: 'blue'
  },
  sectionBtns_btnCitySector: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    color: "#FFF",
    padding: 10,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: "#2f4f4f",
  },
  sectionTitleCitySector: {
    color: "#2f4f4f",
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
  sectionInformations: {
    padding: 15,
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
  settingsBtn: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  generalInfoLabel: {
    color: "#000",
    fontSize: 12,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  generalInfoMembersTitle: {
    color: "#122121",
    fontSize: 14,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  generalInfoMemberElt: {
    flexDirection: "column",
    marginBottom: 10,
    marginTop: 10,
  },
  generalInfoMemberText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "WixMadeforDisplay-Regular",
    fontWeight: "600",
    marginBottom: 5,
  },
  module: {
    paddingHorizontal: 25,
    backgroundColor: "#2f4f4f",
    // backgroundColor: "red",
    paddingVertical: 20,
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
    marginRight: 20,
    maxWidth: 140,
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

  // tabsContent: {
  //   display: 'flex',
  //   flexDirection: 'row'
  // }
});

export default CanalDetails;

// import React, { useState } from 'react';
// import { Button, TextInput, View } from 'react-native';
// import Modal from 'react-native-modal';

// const EditableTextField = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [textFieldValue, setTextFieldValue] = useState('foo');
//   const [tempTextFieldValue, setTempTextFieldValue] = useState(textFieldValue);

//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };

//   const handleSave = () => {
//     setTextFieldValue(tempTextFieldValue);
//     setModalVisible(false);
//   };

//   const handleCancel = () => {
//     setTempTextFieldValue(textFieldValue);
//     setModalVisible(false);
//   };

//   return (
//     <View style={{paddingTop: 60}}>
//       <TextInput value={textFieldValue} editable={false} />
//       <Button title="Edit" onPress={toggleModal} />

//       <Modal isVisible={isModalVisible}>
//         <View style={{backgroundColor: "white", padding: 20}}>
//           <TextInput
//             value={tempTextFieldValue}
//             onChangeText={setTempTextFieldValue}
//           />
//           <Button title="Save" onPress={handleSave} />
//           <Button title="Cancel" onPress={handleCancel} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default EditableTextField;

// import React, { useState } from 'react';
// import { Button, Image, View } from 'react-native';
// import Modal from 'react-native-modal';
// import * as ImagePicker from 'expo-image-picker';

// const EditableImage = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [imageUri, setImageUri] = useState(null);

//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };

//   const handleSave = uri => {
//     setImageUri(uri);
//     setModalVisible(false);
//   };

//   const handleCancel = () => {
//     setModalVisible(false);
//   };

//   const openImagePickerAsync = async () => {
//     let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (permissionResult.granted === false) {
//       alert('Permission to access camera roll is required!');
//       return;
//     }

//     let pickerResult = await ImagePicker.launchImageLibraryAsync();

//     if (pickerResult.canceled === true) {
//       return;
//     }

//     if (pickerResult.assets && pickerResult.assets[0].uri) {
//       handleSave(pickerResult.assets[0].uri);
//     }
//   };

//   return (
//     <View style={{paddingTop: 70}}>
//       {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
//       <Button title="Edit Image" onPress={toggleModal} />

//       <Modal isVisible={isModalVisible}>
//         <View style={{backgroundColor: "white", padding: 20}}>
//           <Button title="Select Image" onPress={openImagePickerAsync} />
//           <Button title="Cancel" onPress={handleCancel} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default EditableImage;
