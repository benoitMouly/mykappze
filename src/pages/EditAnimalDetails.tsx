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
} from "../features/animals/animalSlice";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import CityAndSectorSelect from "../components/cities/cityAndSectorSelect";
import { fetchSectors } from "../features/sectors/sectorSlice";
import ColorSelect from "../components/animals/colorSelect";
import EditableImage from "../components/general/EditableImage";
import EditableDocumentList from "../components/general/EditableDocuments";
import ConfirmationModal from "../components/general/ConfirmationModal";
import CustomAlert from "../components/general/CustomAlert";
import { HeaderEditAnimal } from "../components/general/headerEditAnimal";
import Icon from "react-native-vector-icons/Ionicons";

const EditAnimalDetails = ({ route, navigation }) => {
  const { animalId } = route.params;
  const [animal_id, setAnimalId] = useState("");
  const dispatch = useDispatch();
  const { data: cities } = useSelector((state: RootState) => state.cities);
  const { data: sectors } = useSelector((state: RootState) => state.sectors);
  const [city, setCity] = useState(cities ? cities[0] : "");
  const [cityId, setCityId] = useState(null);
  const [sector, setSector] = useState(sectors ? sectors[0] : "");
  const [sectorId, setSectorId] = useState(null);
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
  const [updatedAnimal, setUpdatedAnimal] = useState(animal);

  // Additional states for DateTimePickerModal
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [imageUri, setImageUri] = useState("");
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

  useEffect(() => {
    if (animal) {
      setSelectedColors(animal.colors);
      setInitialColors(animal.colors);
      setImageUri(animal.image);
      // setDocuments(animal.documents);
      setAnimalId(animal.id);
    }
  }, [animal]);

  useEffect(() => {
    if (documents) {
      setUpdatedAnimal((prevAnimal) => ({ ...prevAnimal, documents }));
    }
  }, [documents]);

  // Update the colors in updatedAnimal whenever selectedColors changes
  useEffect(() => {
    setUpdatedAnimal((prev) => ({
      ...prev,
      colors: selectedColors,
    }));
  }, [selectedColors]);

  useEffect(() => {
    // Vérifie si le secteur sélectionné est toujours valide
    if (!sectors.find((sector) => sector.id === sectorId)) {
      // Si ce n'est pas le cas, réinitialisez le secteur sélectionné
      setSectorId(null);
    }
  }, [sectors, sectorId]);

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setIsModified(true);
    setUpdatedAnimal((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleObjectFormCityChange = async (id, name) => {
    setIsModified(true);
    console.log(isModified);
    setCity(name);
    setCityId(id);
    setSectorId(null);
    dispatch(fetchSectors(id));

    setUpdatedAnimal((prev) => ({
      ...prev,
      cityName: name,
      cityId: id,
    }));
  };

  const handleObjectFormSectorChange = (id, name) => {
    setIsModified(true);
    setSector(name);
    setSectorId(id);

    setUpdatedAnimal((prev) => ({
      ...prev,
      sectorName: name,
      sectorId: id,
    }));
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
    setIsModified(true);
    if (selectedColors.includes(color)) {
      setSelectedColors((prevColors) => prevColors.filter((c) => c !== color));
    } else {
      setSelectedColors((prevColors) => [...prevColors, color]);
    }
  };

  const handleSavePress = async () => {
    // ajoutez async ici

    if (imageUri !== animal.image) {
      dispatch(updateAnimalImage({ animalId, image: imageUri }));
    }

    // if (documents && documents.length > 0) {
    //   const uploadedDocuments = (await Promise.all(documents.map(uploadSingleFile))).filter(Boolean);

    //   console.log("UPLOADED DOCUMENTS : ", uploadedDocuments);
    //   await dispatch(
    //     addDocumentToAnimal({
    //       animalId: animalId,
    //       documents: uploadedDocuments,
    //     })
    //   );
    // }
      console.log('ANIMAL ID ', animalId)
      console.log('ANIMALDATA', updatedAnimal)
      dispatch(updateAnimal({ animalId, animalData: updatedAnimal }));

    setIsModified(false);
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
          <TouchableOpacity  onPress={handleSuppAnimal}>
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
            {/* <View style={styles.buttonIcon}>
            <Icon style={styles.buttonIconElt} name="pencil-outline" size={15} color="#fff" />
          </View> */}
          </View>

          <View style={styles.editElt}>
            <Text style={styles.editEltLabelBorn}>Date de naissance : </Text>

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

        {/* <View style={styles.line} /> */}

        <View style={styles.editUnicalSection}>
          <Text style={styles.editUnicalSectionTitle}>
            Informations générales{" "}
          </Text>
          <View style={styles.containerUnicalSection}>
            {/* Select city */}
            <View style={styles.editEltSelects}>
            <Text style={styles.editEltLabel}>Ville et secteur : </Text>
              <CityAndSectorSelect
                cities={cities}
                sectors={sectors}
                selectedCityId={cityId}
                selectedSectorId={sectorId}
                onCityChange={handleObjectFormCityChange}
                onSectorChange={handleObjectFormSectorChange}
              />
            </View>

            <View style={styles.editEltCheckboxes}>
              <Text style={styles.editEltLabel}>Couleurs de la robe : </Text>
              <ColorSelect
                selectedColors={selectedColors}
                onChange={handleColorChange}
              />
            </View>
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Est stérilisé : </Text>

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
              <Text style={styles.editEltLabel}>Semble malade : </Text>
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
              <Text style={styles.editEltLabel}>Est identifié : </Text>
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
              <Text style={styles.editEltLabel}>Date d'identification : </Text>
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
                Appartient à un propriétaire :{" "}
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
              <Text style={styles.editEltLabel}>Est lié à une famille : </Text>
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
              <Text style={styles.editEltLabel}>Est une mère : </Text>
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
              <Text style={styles.editEltLabel}>AppID de la mère : </Text>
              <TextInput
                value={updatedAnimal.motherAppId}
                onChangeText={(text) => handleInputChange("motherAppId", text)}
                style={styles.textInputWhite}
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
              <Text style={styles.editEltLabel}>Maladies : </Text>
              <TextInput
                value={updatedAnimal.diseases}
                onChangeText={(text) => handleInputChange("diseases", text)}
                style={styles.textInputWhite}
              />
            </View>

            {/* TextInput particularities */}
            <View style={styles.editElt}>
              <Text style={styles.editEltLabel}>Particularités : </Text>
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
    marginBottom: 40
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
    rowGap: 20
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
    borderBottomColor: '#fff',
    height: "100%",
    width: "60%",
    padding: 1,
    textAlign: "center",
    color: '#fff',
    fontFamily: "WixMadeforDisplay-Regular",
  },
  buttonsPicker: {
    backgroundColor: "#2F2F2F",
    padding: 5,
    borderRadius: 3,
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
    width: '100%'
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
  iconTrash:{
    alignItems: "flex-end",
    marginTop: 5,
    padding: 10,
    width: '100%',
  }
};

export default EditAnimalDetails;
