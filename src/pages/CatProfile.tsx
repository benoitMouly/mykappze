import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch } from "../store/store";
import {
  fetchAnimalById,
  fetchMotherById,
  deleteAnimal,
  fetchAnimalsByCanal,
  updateAnimalCitySectorName,
} from "../features/animals/animalSlice";
import { calculateAge } from "../utils/getAge.js";
// import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import AnimalFilters from "../components/animals/animalFilter";
import Genealogy from "../components/animals/genealogy.tsx";
import CommentSection from "../components/animals/comments.tsx";
import { fetchAnimalsByMother } from "../features/animals/parentAnimalSlice";
import Icon from "react-native-vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as WebBrowser from "expo-web-browser";
import logoCatDefault from "../assets/kappze_logo_without_square_bw.png";
import { fetchComments } from "../features/animals/commentsSlice.tsx";
import EditableDocumentList from "../components/general/EditableDocuments.tsx";
import DocumentSection from "../components/animals/documents.tsx";

const AnimalDetails = ({ route }) => {
  const { animalId } = route?.params;
  const comments = useSelector((state) => state.comments);
  const { data: users } = useSelector((state) => state.canalUsers);
  const [documents, setDocuments] = useState([]);
  const { name, uid, isAuthenticated } = useSelector((state) => state.auth);
  const [currentAnimalId, setCurrentAnimalId] = useState(null);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [motherCatId, setMotherCat] = useState("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const animals = useSelector((state) => state.animals.data); // Remplacer par le sélecteur approprié
  // const animal = useSelector((state) => state.animals.selectedAnimal);
  const animal = animals?.find((animal) => animal.id === animalId);

  const dispatch = useAppDispatch();
  const [userIsAdmin, setUserRole] = useState({});
  const [activeTab, setActiveTab] = useState("general-infos");
  const [isModified, setIsModified] = useState(false);
  const [isDocModified, setIsDocModified] = useState(false);

  const navigation = useNavigation();

  const goToEditPage = () => {
    navigation.navigate("EditAnimalDetails", { animalId: animalId });
  };

  const copyToClipboard = async (value) => {
    await Clipboard.setStringAsync(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Initialize blocks states
  const [blocksOpen, setBlocksOpen] = useState({
    infoGeneral: false,
    identification: false,
    relations: false,
    autre: false,
    documents: false,
  });

  // Function to handle blocks toggle
  const toggleBlock = (blockName) => {
    setBlocksOpen((prev) => ({
      ...prev,
      [blockName]: !prev[blockName],
    }));
  };

  // Function to render the correct icon depending on the block state
  const renderIcon = (blockName) => {
    const iconName = blocksOpen[blockName] ? "chevron-up" : "chevron-down";
    return <Icon name={iconName} size={20} color="#000" />;
  };

  const handleDownload = async (document) => {
    try {
      // Ouverture directe du PDF dans le navigateur
      await WebBrowser.openBrowserAsync(document.url);
    } catch (error) {
      alert("Erreur lors de l'ouverture du document.");
      console.error(error);
    }
  };

  useEffect(() => {
    // Initialiser userRoles avec les rôles actuels des utilisateurs
    users.forEach((user) => {
      if (user.id === uid) {
        setUserRole(user.isAdmin);
      }
    });
  }, [users]);

  useEffect(() => {
    if (animalId !== currentAnimalId) {
      dispatch(fetchAnimalById(animalId));
      dispatch(fetchAnimalsByCanal(animal.canalId));
      setCurrentAnimalId(animalId);
      dispatch(fetchComments(animalId));
    }
  }, [animalId, dispatch]);

  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler une requête de réseau
    wait(2000).then(() => {
      setRefreshing(false), dispatch(fetchAnimalById(animalId));
      dispatch(fetchAnimalsByCanal(animal.canalId));
      setCurrentAnimalId(animalId);
      dispatch(fetchComments(animalId));
    });
  }, []);

  useEffect(() => {
    if (animal && animal.id === animalId && animal.motherAppId) {
      dispatch(fetchMotherById(animal.motherAppId));
      setMotherCat(animal.motherAppId);
      setFilteredAnimals(
        animals.filter(
          (animale) =>
            (animale.motherAppId === animal.motherAppId ||
              animale.id == animal.motherAppId) &&
            animale.id !== animal.id
        )
      );
      // console.log("ouai ouai");
      // console.log(animals);
    } else if (
      animal &&
      animal.id === animalId &&
      animal.isMother &&
      !animal.motherAppId
    ) {
      dispatch(fetchAnimalsByMother(animalId));
      setFilteredAnimals(
        animals.filter((animal) => animal.motherAppId === animalId)
      );
      setMotherCat("");
    } else {
      console.log(filteredAnimals);
      setMotherCat("");
      // return
    }
  }, [animalId, dispatch, currentAnimalId, animal, motherCatId, animals]);

  if (!animal) {
    return (
      <View style={styles.modalView}>
        <Text style={styles.modalText}>
          L'animal que vous cherchez n'existe pas.
        </Text>
        <Image
          source={require("../assets/transparent-without-circle.png")}
          style={styles.logo}
        />
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl progressViewOffset ={85}
           refreshing={refreshing} onRefresh={onRefresh} style={{paddingTop: 200}} />
        }
      >
        <View style={styles.header}>
          <View style={styles.header1st}>
            <View>
              {animal?.image ? (
                <Image
                  source={{ uri: animal.image.url }}
                  style={styles.image}
                />
              ) : (
                <Image source={logoCatDefault} style={styles.image} />
              )}
            </View>

            <View style={styles.nameId}>
              <Text style={styles.title}>
                {animal?.name ? animal.name : "Aucun nom"}
              </Text>
              {/* <TouchableOpacity
                onPress={() => {
                  copyToClipboard(animal.id);
                }}
                style={styles.sectionShare_button}
              >
                <Text style={styles.sectionShare_buttonText} selectable={true}>
                  {isCopied ? "Copié !" : animal?.id}
                </Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.settingsBtn}>
              {userIsAdmin == true && (
                <TouchableOpacity
                  onPress={goToEditPage}
                  style={{
                    backgroundColor: "#fff",
                    padding: 5,
                    borderRadius: 50,
                  }}
                >
                  <Icon name="create-outline" size={24} color="#000" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.headerInfo_col}>
              {animal.sex === "Mâle" ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.subtitle}>Mâle </Text>
                  <Icon name={"male-outline"} size={20} color="#fff" />
                </View>
              ) : animal.sex === "Femelle" ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.subtitle}>Femelle </Text>
                  <Icon name={"female-outline"} size={20} color="#fff" />
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.subtitle}>Sexe inconnu </Text>
                </View>
              )}

              <Text style={styles.subtitle}>
                {animal.age
                  ? `Age : ${calculateAge(animal.age)} `
                  : "Age inconnu"}
              </Text>
            </View>

            <View style={styles.headerInfo_col}>
              <View style={styles.buttonGroupIcons}>
                <Image
                  source={require("../assets/icons/icon-city.png")}
                  style={styles.buttonIcon}
                />
                <Text style={styles.subtitle}>
                  {animal.citySectorName
                    ? animal.citySectorName
                    : "Secteur inconnu"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* MODULE */}

        <View style={styles.module}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={styles.labeltabs}
              onPress={() => setActiveTab("general-infos")}
            >
              <Text
                style={
                  activeTab === "general-infos" ? styles.activeTab : styles.tab
                }
              >
                <Icon
                  name="information-circle-outline"
                  size={24}
                  color={activeTab === "general-infos" ? "#2f4f4f" : "#fff"}
                />
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.labeltabs}
              onPress={() => setActiveTab("identification")}
            >
              <Text
                style={
                  activeTab === "identification" ? styles.activeTab : styles.tab
                }
              >
                <Icon
                  name="reader-outline"
                  size={24}
                  color={activeTab === "identification" ? "#2f4f4f" : "#fff"}
                />
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.labeltabs}
              onPress={() => setActiveTab("relations")}
            >
              <Text
                style={
                  activeTab === "relations" ? styles.activeTab : styles.tab
                }
              >
                <Icon
                  name="pricetag-outline"
                  size={24}
                  color={activeTab === "relations" ? "#2f4f4f" : "#fff"}
                />
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.labeltabs}
              onPress={() => setActiveTab("autre")}
            >
              <Text
                style={activeTab === "autre" ? styles.activeTab : styles.tab}
              >
                <Icon
                  name="ellipsis-horizontal-outline"
                  size={24}
                  color={activeTab === "autre" ? "#2f4f4f" : "#fff"}
                />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.tabsContent}>
              {activeTab === "general-infos" && (
                <View style={styles.contentAnimaux}>
                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Canal : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.canalName ? animal.canalName : null}
                    </Text>
                  </View>
                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Couleurs : </Text>
                    {animal.colors && animal.colors.length > 0
                      ? animal.colors.map((color, index) => (
                          <Text key={index} style={styles.infosLabel_text}>
                            {color}
                          </Text>
                        ))
                      : null}
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Est stérilisé : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isSterilise ? "Oui" : "Non"}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Semble malade : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isSick ? "Oui" : "Non"}
                    </Text>
                  </View>
                </View>
              )}

              {activeTab === "identification" && (
                <View style={styles.contentAnimaux}>
                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Est identifié : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isIdentificated ? "Oui" : "Non"}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>
                      Numéro d'identification :{" "}
                    </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.idNumber ? animal.idNumber : "Non renseigné"}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>
                      Date d'identification :
                    </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.identificationDate
                        ? animal.identificationDate
                        : null}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>
                      Appartient à un propriétaire :
                    </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isBelonged ? "Oui" : "Non"}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>KappzeID :</Text>
                    <TouchableOpacity
                      onPress={() => {
                        copyToClipboard(animal.id);
                      }}
                      style={styles.sectionShare_button}
                    >
                      <Text
                        style={styles.sectionShare_buttonText}
                        selectable={true}
                      >
                        {isCopied ? "Copié !" : animal?.id}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {activeTab === "relations" && (
                <View style={styles.contentAnimaux}>
                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>
                      Est lié à une famille :
                    </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isFamily ? "Oui" : "Non"}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Est une mère : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isMother ? "Oui" : "Non"}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Nom de la mère : </Text>
                    <Text style={styles.infosLabel_text}>{animal.mother}</Text>
                  </View>
                </View>
              )}

              {activeTab === "autre" && (
                <View style={styles.contentAnimaux}>
                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Maladies : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.diseases}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Particularités : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.particularities}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* MODULE END */}

        <View style={{ backgroundColor: "#2f4f4f", paddingTop: 20 }}>
          {filteredAnimals.length > 0 ? (
            <>
              <View style={styles.sectionListingFilters}>
                <Text style={styles.sectionListingFilters_title}>
                  De la famille
                </Text>
                <AnimalFilters animals={filteredAnimals} />
              </View>
              <View style={styles.sectionListingFilters}>
                <Text style={styles.sectionListingFilters_title_genealogie}>
                  Généalogie
                </Text>
                <Genealogy currentAnimalId={animal.id} />
              </View>
            </>
          ) : (
            <>
              <Text>Cet animal n'a pas de relations</Text>
            </>
          )}
        </View>
      </ScrollView>
      {comments.length >= 0 ? (
        <View style={styles.footer}>
          <CommentSection
            animalId={animal.id}
            commentsLength={comments.length}
            animalName={animal?.name}
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
          <DocumentSection
            documents={documents}
            setDocuments={setDocuments}
            setIsDocModified={setIsDocModified}
            setIsModified={setIsModified}
            animal={animal}
            documentsLength={animal?.documents?.length}
            userIsAdmin={userIsAdmin}
          />
        </View>
      ) : null}
    </View>
  );
};

export default AnimalDetails;
// function setCurrentAnimalId(id: any) {
//   throw new Error("Function not implemented.");
// }

const styles = {
  header: {
    flexDirection: "column",
    backgroundColor: "#2F4F4F",
    padding: 20,
  },
  header1st: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#2F4F4F",
    paddingTop: 20,
  },
  nameId: {
    display: "flex",
    alignItems: "center",
    rowGap: 15,
  },
  settingsBtn: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  headerInfo: {
    flexDirection: "row",
    rowGap: 20,
    justifyContent: "space-around",
  },
  headerInfo_col: {
    rowGap: 15,
  },
  container: {
    paddingTop: 100,
    paddingBottom: 50,
    height: "100%",
    backgroundColor: "#2f4f4f",
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  subtitle: {
    color: "#FFF",
    fontFamily: "WixMadeforDisplay-Regular",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 100,
    backgroundColor: "#122",
    // padding: 20
  },
  infos: {
    // marginLeft: 20,
    // marginRight: 20,
    backgroundColor: "#2F4F4F",
  },
  infosLabel: {
    display: "flex",
    flexDirection: "row",
    fontFamily: "WixMadeforDisplay-Regular",
    fontWeight: "bold",
    color: "#2f4f4f",
    marginRight: 10,
  },
  infosLabel_text: {
    fontFamily: "WixMadeforDisplay-Regular",
    marginRight: 10,
  },
  blocInfos: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 2,
  },
  blocTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    // columnGap: 10
    // paddingHorizontal: 30,
  },
  blocInfosTitle: {
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    textAlign: "right",
  },
  unicalInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
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
    fontSize: 10,
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
    borderRadius: 2,
    // width: "100%",
  },
  sectionShare_buttonText: {
    color: "#000",
    fontFamily: "WixMadeforDisplay-Regular",
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
    fontSize: 14,
  },
  buttonGroupIcons: {
    display: "flex",
    flexDirection: "row",
  },
  buttonIcon: {
    marginRight: 5,
    width: 20,
    height: 20,
    backgroundColor: "black",
    borderRadius: 40,
  },
  sectionListingFilters: {
    // backgroundColor: 'red',
    // padding: 30
  },
  sectionListingFilters_title: {
    fontSize: 18,
    color: "#fff",
    paddingTop: 10,
    paddingLeft: 30,
    paddingBottom: 0,
    fontFamily: "WixMadeforDisplay-Bold",
    position: "absolute",
  },
  sectionListingFilters_title_genealogie: {
    fontSize: 18,
    color: "#fff",
    // paddingTop: 80,
    paddingLeft: 30,
    paddingBottom: 20,
    fontFamily: "WixMadeforDisplay-Bold",
    // position: "absolute",
  },
  parentContainer: {
    flex: 1,
    paddingBottom: 50,
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
    // padding: 10,
    // borderBottomWidth: 5,
    paddingTop: 40,
    // marginTop: 10,
  },
  commentFormContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%", // vous pouvez ajuster cette valeur en fonction de vos besoins
    backgroundColor: "#fff",
  },
  downloadButton: {
    marginLeft: 10,
    // padding: 5,
    backgroundColor: "#fff",
    borderRadius: 50,
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 3,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 20,
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
    // marginRight: 20
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
    marginRight: 20,
  },
  tabsContent: {
    padding: 0,
    backgroundColor: "rgb(242,242,242)",
  },
  contentAnimaux: {
    display: "flex", // implicitement défini pour tous les éléments React Native
    flexDirection: "column",
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
};
