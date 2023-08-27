import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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

const AnimalDetails = ({ route }) => {
  const { animalId } = route?.params;
  const comments = useSelector((state) => state.comments);
  const { data: users } = useSelector((state) => state.canalUsers);

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
        <Text style={styles.modalText}>L'animal que vous cherchez n'existe pas.</Text>
        <Image source={require('../assets/transparent-without-circle.png')} style={styles.logo} /> 

      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Bloc green */}
        <View style={styles.header}>
          <View style={styles.header1st}>
            <View>
              {animal?.image ? (
                <Image source={{ uri: animal.image }} style={styles.image} />
              ) : (
                <Image source={logoCatDefault} style={styles.image} />
              )}
            </View>

            <View style={styles.nameId}>
              <Text style={styles.title}>
                {animal?.name ? animal.name : "Aucun nom"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  copyToClipboard(animal.id);
                }}
                style={styles.sectionShare_button}
              >
                <Text style={styles.sectionShare_buttonText} selectable={true}>
                  {isCopied ? "Copié !" : animal?.id}
                </Text>
              </TouchableOpacity>
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
                  {/* <Icon name={"female-outline"} size={20} color="#fff" /> */}
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
                    ? updateAnimalCitySectorName
                    : "Secteur inconnu"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bloc General d'infos */}
        <View style={styles.infos}>
          {/* Bloc General 1 */}
          <TouchableOpacity onPress={() => toggleBlock("infoGeneral")}>
            <View style={styles.blocInfos}>
              <View style={styles.blocTitle}>
                <Text style={styles.blocInfosTitle}>
                  Informations générales
                </Text>
                {renderIcon("infoGeneral")}
              </View>

              {blocksOpen.infoGeneral && (
                <>
                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Canal : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.canalName ? animal.canalName : null}
                    </Text>
                  </View>
                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Couleurs : </Text>
                    {animal.colors && animal.colors.length > 0 && (
                      <>
                        {animal.colors.map((color, index) => (
                          <Text key={index} style={styles.infosLabel_text}>
                            {color}
                          </Text>
                        ))}
                      </>
                    )}
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Est stérilisé : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isSterilized ? "Oui" : "Non"}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Semble malade : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isSick ? "Oui" : "Non"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Bloc General 2 */}
          <TouchableOpacity onPress={() => toggleBlock("identification")}>
            <View style={styles.blocInfos}>
              <View style={styles.blocTitle}>
                <Text style={styles.blocInfosTitle}>Identification</Text>
                {renderIcon("identification")}
              </View>

              {blocksOpen.identification && (
                <>
                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>Est identifié : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isIdentificated ? "Oui" : "Non"}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>
                      Date d'identification :{" "}
                    </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.identificationDate
                        ? animal.identificationDate
                        : null}
                    </Text>
                  </View>

                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>
                      Appartient à un propriétaire :{" "}
                    </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.isBelonged ? "Oui" : "Non"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Bloc General 3 */}
          <TouchableOpacity onPress={() => toggleBlock("relations")}>
            <View style={styles.blocInfos}>
              <View style={styles.blocTitle}>
                <Text style={styles.blocInfosTitle}>Relations</Text>
                {renderIcon("relations")}
              </View>

              {blocksOpen.relations && (
                <>
                  <View style={styles.unicalInfo}>
                    <Text style={styles.infosLabel}>
                      Est lié à une famille :{" "}
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
                    <Text style={styles.infosLabel}>AppID de la mère : </Text>
                    <Text style={styles.infosLabel_text}>
                      {animal.motherAppId}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Bloc General 4 */}
          <TouchableOpacity onPress={() => toggleBlock("autre")}>
            <View style={styles.blocInfos}>
              <View style={styles.blocTitle}>
                <Text style={styles.blocInfosTitle}>Autre</Text>
                {renderIcon("autre")}
              </View>

              {blocksOpen.autre && (
                <>
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
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Bloc General 5 */}
          <TouchableOpacity onPress={() => toggleBlock("documents")}>
            <View style={styles.blocInfos}>
              <View style={styles.blocTitle}>
                <Text style={styles.blocInfosTitle}>Documents</Text>
                {renderIcon("documents")}
              </View>

              {blocksOpen.documents && animal.documents && (
                <View style={{ marginTop: 10 }}>
                  {animal.documents.map((document, index) => (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <Text style={styles.infosLabel_text} key={index}>
                        {document.name}
                      </Text>
                      <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={() => handleDownload(document)}
                      >
                        <Icon name="download-outline" size={24} color="#000" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View>
          {filteredAnimals.length > 0 ? (
            <>
              <View style={styles.sectionListingFilters}>
                <Text style={styles.sectionListingFilters_title}>
                  Descendance
                </Text>
                <AnimalFilters animals={filteredAnimals} />
              </View>
              <View style={styles.sectionListingFilters}>
                <Text style={styles.sectionListingFilters_title_genealogie}>
                  Généalogie
                </Text>
                <Genealogy currentAnimalId={animal.id} />
              </View>
              {/* </ScrollView> */}
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
        </View>
      ) : null}
    </>
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
    padding: 30,
  },
  header1st: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#2F4F4F",
    paddingTop: 20,
  },
  nameId: {
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
    padding: 0,
    height: "100%",
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
    marginRight: 10,
    borderRadius: 100,
  },
  infos: {
    // marginLeft: 20,
    // marginRight: 20,
    backgroundColor: "#2F4F4F",
  },
  infosLabel: {
    fontFamily: "WixMadeforDisplay-Regular",
    fontWeight: "bold",
    color: "#2f4f4f",
    // textDecorationLine: "underline",
    marginRight: 10,
  },
  infosLabel_text: {
    fontFamily: "WixMadeforDisplay-Regular",
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
    width: "100%",
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
    // backgroundColor: '#FFF',
    // padding: 30
  },
  sectionListingFilters_title: {
    fontSize: 18,
    color: "#2F4F4F",
    paddingTop: 10,
    paddingLeft: 30,
    paddingBottom: 0,
    fontFamily: "WixMadeforDisplay-Bold",
    position: "absolute",
  },
  sectionListingFilters_title_genealogie: {
    fontSize: 18,
    color: "#2F4F4F",
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
    // marginRight: 10,
    backgroundColor: 'white',
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
    fontSize: 20
  },
};
