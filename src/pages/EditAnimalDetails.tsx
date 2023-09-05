import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Switch,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  fetchAnimalById,
  updateAnimal,
  updateAnimalImage,
  uploadSingleFile,
  addDocumentToAnimal,
  deleteAnimal,
  fetchAnimalsByCanal,
} from "../features/animals/animalSlice";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import CitySectorAndSectorSelect from "../components/citiesSector/citySectorAndSectorSelect";
import ColorSelect from "../components/animals/colorSelect";
import EditableImage from "../components/general/EditableImage";
import EditableDocumentList from "../components/general/EditableDocuments";
import ConfirmationModal from "../components/general/ConfirmationModal";
import CustomAlert from "../components/general/CustomAlert";
import { HeaderEditAnimal } from "../components/general/headerEditAnimal";
import Icon from "react-native-vector-icons/Ionicons";
import { createAndSendNotification } from "../features/notifications/notificationSlice";
import MotherSelect from "../components/animals/motherSelect";

const EditAnimalDetails = ({ route, navigation }) => {
  const { animalId } = route.params;
  const [animal_id, setAnimalId] = useState("");
  const { data: animals } = useSelector((state) => state.animals)
  const dispatch = useDispatch();
  const { data: citiesSector } = useSelector(
    (state: RootState) => state.citiesSector
  );
  const { data: id } = useSelector((state: RootState) => state.canals);
  const [citySector, setCitySector] = useState(
    citiesSector ? citiesSector[0] : ""
  );
  const [citySectorId, setCitySectorId] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [initialColors, setInitialColors] = useState([]);
  const [documents, setDocuments] = useState([]);
  // const [message, setMessage] = useState('');
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [dateBirthdate, setBirthdate] = useState("");
  const [dateId, setDateId] = useState("");

  // const navigation = useNavigation();

  // Fetch animal information
  useEffect(() => {
    dispatch(fetchAnimalById(animalId));
  }, [animalId, dispatch]);

  const animal = useSelector((state) => state.animals.selectedAnimal);
  const motherAnimals = animals.filter((animal) => animal.isMother);

  const motherAnimal = useSelector((state) => state.animals.motherAnimal);
  const [updatedAnimal, setUpdatedAnimal] = useState(animal);

  // Additional states for DateTimePickerModal
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [isDocModified, setIsDocModified] = useState(false);


  const [motherId, setMotherId] = useState(motherAnimal?.id);
  const [mother, setMother] = useState(motherAnimal?.name);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      console.log('DEDANS')
      // Empêche le geste de retour par défaut
      if (!isModified) {
        // Si aucune modification n'a été apportée, laissez l'utilisateur quitter la page.
        console.log('conditoin rempli')
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
  }, [navigation, isModified, isDocModified]);

  useEffect(() => {
    if (animal) {
      setSelectedColors(animal.colors);
      setInitialColors(animal.colors);
      setImageUri(animal.image.url);
      setDocuments(animal.documents);
      setAnimalId(animal.id);
    }
  }, [animal]);

  useEffect(() => {
    if (documents) {
      setUpdatedAnimal((prevAnimal) => ({ ...prevAnimal, documents }));
      // console.log("documents : ", documents);
    }
  }, [documents]);

  // Update the colors in updatedAnimal whenever selectedColors changes
  useEffect(() => {
    setUpdatedAnimal((prev) => ({
      ...prev,
      colors: selectedColors,
    }));
  }, [selectedColors, isModified]);

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setIsModified(true);
    setUpdatedAnimal((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleObjectFormCitySectorChange = async (id, name) => {
    setIsModified(true);
    console.log(isModified);
    setCitySector(name);
    setCitySectorId(id);
    setUpdatedAnimal((prev) => ({
      ...prev,
      citySectorName: name,
      citySectorId: id,
    }));
  };

  const handleObjectFormAnimalChange = async (id, name) => {
    setMother(name);
    setMotherId(id);
    handleInputChange("motherAppId", id)
  };


  const handleConfirmIdentificationDate = (date) => {
    setIsModified(true);
    const formattedDate = date.toISOString().split("T")[0];
    setDatePickerVisibility(false);
    setDateId(formattedDate);
    handleInputChange("identificationDate", formattedDate);
  };

  const handleConfirmAge = (date) => {
    setIsModified(true);
    const formattedDate = date.toISOString().split("T")[0];
    setDatePickerVisibility2(false);
    setBirthdate(formattedDate);
    handleInputChange("age", formattedDate);
  };

  const handleColorChange = (color) => {
    
    if (selectedColors.includes(color)) {
      setSelectedColors((prevColors) => prevColors.filter((c) => c !== color));
      setIsModified(true);
    } else {
      setSelectedColors((prevColors) => [...prevColors, color]);
      setIsModified(true);
    }
    console.log('IS MODIFIED AFTER COLORS : ', isModified)
  };

  const handleSavePress = async () => {
    // ajoutez async ici

    if (imageUri !== animal.image.url) {
      dispatch(updateAnimalImage({ animalId, image: imageUri }));
    }

    if (isDocModified) {
      const message =
        "Un nouveau document est disponible pour l'animal : " +
        (animal?.name || animal?.id);
      const userIds = [
        "oo1qP9CNSYNvgzingDITVJ4XL3a2",
        "zcsYehEmnLStL5twOUlP4Ee7FyK2",
        "4jEvW3mzCqO6GtLt4vHfYZxCHDI3",
      ];
      dispatch(createAndSendNotification({ userIds, message }));
    }
    dispatch(updateAnimal({ animalId, animalData: updatedAnimal }));

    setIsModified(false);
    setIsDocModified(false);
  };

  const handleSuppAnimal = async () => {
    // console.log(id);
    if (animal.id) {
      setConfirmationVisible(true); // Affiche la modale de confirmation
    }
  };

  const handleConfirmSuppression = async () => {
    // console.log(id)
    await dispatch(deleteAnimal(animal.id));
    setConfirmationVisible(false); // Ferme la modale de confirmation
    setAlertMessage("L'animal a été supprimé avec succès"); // Définir le message d'alerte
    setAlertVisible(true); // Affiche la modale d'alerte
    // dispatch(fetchAnimalsByCanal(animal.canalId))
    // navigation.navigate(-1);
  };

  // If animal is not yet loaded, display a loading text
  if (!updatedAnimal) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <HeaderEditAnimal navigation={navigation} animalName={animal.name} />
      <ScrollView style={styles.editAnimal}>
        <View style={styles.iconTrash}>
          <TouchableOpacity onPress={handleSuppAnimal}>
            <Icon name="trash-outline" size={30} color="#C40030" />
          </TouchableOpacity>
        </View>

        <View style={styles.imgNameAge}>
          <View style={styles.editElt}>
            <View>
              <EditableImage imageUri={imageUri} setImageUri={setImageUri} />
            </View>
          </View>
          <View style={styles.editElt}>
            <TextInput
              value={updatedAnimal.name}
              onChangeText={(text) => handleInputChange("name", text)}
              style={styles.textInput}
            />
          </View>

          <View style={styles.editElt}>
            <Text style={styles.editEltLabelBorn}>Date de naissance </Text>

            <TouchableOpacity
              onPress={() => setDatePickerVisibility2(true)}
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonText}>
                {animal.age
                  ? animal.age
                  : dateBirthdate
                  ? dateBirthdate
                  : "Choisir"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible2}
              mode="date"
              onConfirm={handleConfirmAge}
              onCancel={() => setDatePickerVisibility2(false)}
              style={{
                shadowColor: "#fff",
                shadowRadius: 0,
                shadowOpacity: 1,
                shadowOffset: { height: 0, width: 0 },
              }}
            />
          </View>
        </View>
        <View style={styles.editUnicalSection}>
          <Text style={styles.editUnicalSectionTitle}>
            Informations générales{" "}
          </Text>
          <View style={styles.containerUnicalSection}>
            {/* Select citySector */}
            <View style={styles.editEltSelects}>
              <Text style={styles.editEltLabel}>Secteur </Text>
              <CitySectorAndSectorSelect
                citiesSector={citiesSector}
                selectedCitySectorId={citySectorId}
                onCitySectorChange={handleObjectFormCitySectorChange}
              />
            </View>

            <View style={styles.editEltCheckboxes}>
              <Text style={styles.editEltLabel}>Couleurs de la robe </Text>
              <ColorSelect
                selectedColors={selectedColors}
                onChange={handleColorChange}
              />
            </View>
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Est stérilisé </Text>

              <Switch
                onValueChange={(newValue) =>
                  handleInputChange("isSterilized", newValue)
                }
                value={updatedAnimal.isSterilized}
                trackColor={{ true: "#d15e41" }}
                thumbColor={"#d15e41"}
              />
            </View>

            {/* Toggle isSick */}
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Semble malade </Text>
              <Switch
                onValueChange={(newValue) =>
                  handleInputChange("isSick", newValue)
                }
                value={updatedAnimal.isSick}
                trackColor={{ true: "#d15e41" }}
                thumbColor={"#d15e41"}
              />
            </View>
          </View>
        </View>

        {/* <View style={styles.line} /> */}

        <View style={styles.editUnicalSection}>
          <Text style={styles.editUnicalSectionTitle}>Identification</Text>
          {/* Toggle isIdentificated */}
          <View style={styles.containerUnicalSection}>
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Est identifié </Text>
              <Switch
                onValueChange={(newValue) =>
                  handleInputChange("hasIdNumber", newValue)
                }
                value={updatedAnimal.hasIdNumber}
                trackColor={{ true: "#d15e41" }}
                thumbColor={"#d15e41"}
              />
            </View>

            {/* Date identificationDate */}
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Date d'identification </Text>
              <TouchableOpacity
                onPress={() => setDatePickerVisibility(true)}
                style={styles.buttonsPicker}
              >
                <Text style={styles.buttonText}>
                  {dateId ? dateId : "Choisir"}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmIdentificationDate}
                onCancel={() => setDatePickerVisibility(false)}
              />
            </View>

            {/* Toggle isBelonged */}
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>
                Appartient à un propriétaire 
              </Text>
              <Switch
                onValueChange={(newValue) =>
                  handleInputChange("isBelonged", newValue)
                }
                value={updatedAnimal.isBelonged}
                trackColor={{ true: "#d15e41" }}
                thumbColor={"#d15e41"}
              />
            </View>
          </View>
        </View>

        {/* <View style={styles.line} /> */}

        <View style={styles.editUnicalSection}>
          <Text style={styles.editUnicalSectionTitle}>Relations</Text>
          {/* Toggle isFamily */}
          <View style={styles.containerUnicalSection}>
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Est lié à une famille </Text>
              <Switch
                onValueChange={(newValue) =>
                  handleInputChange("isFamily", newValue)
                }
                value={updatedAnimal.isFamily}
                trackColor={{ true: "#d15e41" }}
                thumbColor={"#d15e41"}
              />
            </View>

            {/* Toggle isMother */}
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Est une mère </Text>
              <Switch
                onValueChange={(newValue) =>
                  handleInputChange("isMother", newValue)
                }
                value={updatedAnimal.isMother}
                trackColor={{ true: "#d15e41" }}
                thumbColor={"#d15e41"}
              />
            </View>

            {/* TextInput motherAppId */}
            <View style={styles.editElt}>
              {/* <Text style={styles.editEltLabel}>AppID de la mère : </Text>
              <TextInput
                value={updatedAnimal.motherAppId}
                onChangeText={(text) => handleInputChange("motherAppId", text)}
                style={styles.textInputWhite}
              /> */}

              <MotherSelect
                animals={motherAnimals}
                selectedAnimalId={motherId}
                onAnimalChange={handleObjectFormAnimalChange}
                needsLabel={true}
              />

            </View>
          </View>
        </View>

        {/* <View style={styles.line} /> */}

        <View style={styles.editUnicalSection}>
          <Text style={styles.editUnicalSectionTitle}>Autre</Text>
          {/* TextInput diseases */}

          <View style={styles.containerUnicalSection}>
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Maladies </Text>
              <TextInput
                value={updatedAnimal.diseases}
                onChangeText={(text) => handleInputChange("diseases", text)}
                style={styles.textInputWhite}
              />
            </View>

            {/* TextInput particularities */}
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Particularités </Text>
              <TextInput
                value={updatedAnimal.particularities}
                onChangeText={(text) =>
                  handleInputChange("particularities", text)
                }
                style={styles.textInputWhite}
              />
            </View>
          </View>
        </View>

        {/* <View style={styles.line} /> */}

        <View style={styles.editUnicalSection}>
          {/* <View style={styles.editEltDocuments}> */}
          <Text style={styles.editUnicalSectionTitle}>Documents</Text>
          <View style={styles.containerUnicalSection}>
            <EditableDocumentList
              documents={documents}
              setDocuments={setDocuments}
              setIsDocModified={setIsDocModified}
              setIsModified={setIsModified}
              animalName = {animal.name}
            />
          </View>
          {/* </View> */}
        </View>

        {/* <View style={styles.line} /> */}

        <View style={styles.editUnicalSection}></View>

        <CustomAlert
          visible={isAlertVisible}
          onClose={() => setAlertVisible(false)}
          message={alertMessage}
        />
        <ConfirmationModal
          visible={isConfirmationVisible}
          onClose={() => setConfirmationVisible(false)}
          onConfirm={handleConfirmSuppression}
          messageType={"Voulez-vous vraiment supprimer cet animal ?"}
        />
      </ScrollView>

      <View style={styles.btnSectionSuppSave}>
        <TouchableOpacity onPress={handleSavePress} style={styles.btnSave}>
          <Text style={styles.buttonSaveText}>SAUVEGARDER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    height: "100%",
    margin: 0,
  },
  containerUnicalSection: {
    backgroundColor: "#2F4F4F",
    padding: 15,
    // marginBottom: 20
  },
  editAnimal: {
    // padding: 5,
    flexDirection: "column",
    rowGap: 50,
    marginBottom: 40,
  },
  editUnicalSection: {
    flexDirection: "column",
    rowGap: 20,
    marginTop: 20,
    // backgroundColor: 'blue',
    // margin: 20,
  },
  editUnicalSectionTitle: {
    fontSize: 18,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    textAlign: "left",
    color: "#2F4F4F",
    marginLeft: 15,
  },
  imgNameAge: {
    alignItems: "center",
    rowGap: 20,
    // marginTop: 60
  },
  viewImg: {},
  editElt: {
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    height: 2,
    backgroundColor: "#000", // change this to fit your design
    // alignSelf: 'start',
    marginVertical: 20, // space above and below the line
    width: "40%", // change this to fit your design
  },
  editEltCheckboxes: {
    marginHorizontal: 15,
    flexDirection: "column",
  },
  editEltSelects: {
    marginHorizontal: 15,
    flexDirection: "column",
    rowGap: 20,
  },
  // editEltDocuments: {
  //   marginHorizontal: 15,
  //   flexDirection: "column",
  // },
  editEltLabel: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    marginRight: 10
  },
  editEltLabelBorn: {
    color: "#000",
    fontSize: 15,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  textInput: {
    borderBottomWidth: 1,
    height: "100%",
    width: "50%",
    padding: 1,
    textAlign: "center",
  },
  textInputWhite: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    height: "100%",
    width: "60%",
    padding: 1,
    textAlign: "center",
    color: "#fff",
    fontFamily: "WixMadeforDisplay-Regular",
  },
  buttonsPicker: {
    backgroundColor: "#122121",
    padding: 5,
    borderRadius: 2,
  },
  buttonText: {
    padding: 2,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
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
  btnSupp: {
    backgroundColor: "red",
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
  buttonIcon: {
    // marginRight: 5,
    // margin: 10,
    width: 30,
    height: 30,
    backgroundColor: "black",
    borderRadius: 2,
    paddingTop: 1,
    // padding: 20
  },
  buttonIconElt: {
    margin: 7,
  },
  iconTrash: {
    alignItems: "flex-end",
    marginTop: 5,
    padding: 10,
    width: "100%",
  },
};

export default EditAnimalDetails;
