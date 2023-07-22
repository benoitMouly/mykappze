import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Switch,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
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

const EditAnimalDetails = ({ route }) => {
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

  useEffect(() => {
    if (animal) {
      setSelectedColors(animal.colors);
      setInitialColors(animal.colors);
      setImageUri(animal.image);
      setDocuments(animal.documents);
      setAnimalId(animal.id);
    }
  }, [animal]);

  useEffect(() => {
    setUpdatedAnimal((prevAnimal) => ({ ...prevAnimal, documents }));
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
    setUpdatedAnimal((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleObjectFormCityChange = async (id, name) => {
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
    setSector(name);
    setSectorId(id);

    setUpdatedAnimal((prev) => ({
      ...prev,
      sectorName: name,
      sectorId: id,
    }));
  };

  const handleConfirmIdentificationDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setDatePickerVisibility(false);
    setDateId(formattedDate)
    handleInputChange("identificationDate", formattedDate);
  };

  const handleConfirmAge = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setDatePickerVisibility2(false);
    setBirthdate(formattedDate);
    handleInputChange("age", formattedDate);
  };

  const handleColorChange = (color) => {
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

    if (documents.length && documents.length > 0 && documents) {
      const uploadedDocuments = await Promise.all(
        documents.map(uploadSingleFile)
      );
      console.log("UPLOADED DOCUMENTS : ", uploadedDocuments);
      await dispatch(
        addDocumentToAnimal({
          animalId: animalId,
          documents: uploadedDocuments,
        })
      );
    }

    dispatch(updateAnimal({ animalId, animalData: updatedAnimal }));
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

  // const handleSuppAnimal = async () => {
  //   if(animal.id === id){
  //     await dispatch(
  //       deleteAnimal(id)
  //     )
  //   }
  // }

  // If animal is not yet loaded, display a loading text
  if (!updatedAnimal) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.editAnimal}>
      <Text>Modification de {animal.name}</Text>
      <View style={styles.editUnicalSection}>
      <Text style={styles.editUnicalSectionTitle}>Profil : </Text>
        <View style={styles.editElt}>
          
          <View>
            <EditableImage imageUri={imageUri} setImageUri={setImageUri} />
          </View>
        </View>
        <View style={styles.editElt}>
          <Text style={styles.editEltLabel}>Nom : </Text>
          <TextInput
            value={updatedAnimal.name}
            onChangeText={(text) => handleInputChange("name", text)}
            style={styles.textInput}
          />
        </View>

        <View style={styles.editElt}>
          <Text style={styles.editEltLabel}>Date de naissance : </Text>

          <TouchableOpacity
            onPress={() => setDatePickerVisibility2(true)}
            style={styles.buttonsPicker}
          >
            <Text style={styles.buttonText}>
              {dateBirthdate ? dateBirthdate : "Choisir"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible2}
            mode="date"
            onConfirm={handleConfirmAge}
            onCancel={() => setDatePickerVisibility2(false)}
          />
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.editUnicalSection}>
        <Text style={styles.editUnicalSectionTitle}>Informations générales : </Text>
        {/* Select city */}
        <View style={styles.editEltSelects}>
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
            trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'}
          />
        </View>

        {/* Toggle isSick */}
        <View style={styles.editElt}>
          <Text style={styles.editEltLabel}>Semble malade : </Text>
          <Switch
            onValueChange={(newValue) => handleInputChange("isSick", newValue)}
            value={updatedAnimal.isSick}
            trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'}
          />
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.editUnicalSection}>
        <Text style={styles.editUnicalSectionTitle}>Identification : </Text>
        {/* Toggle isIdentificated */}
        <View style={styles.editElt}>
          <Text style={styles.editEltLabel}>Est identifié : </Text>
          <Switch
            onValueChange={(newValue) =>
              handleInputChange("hasIdNumber", newValue)
            }
            value={updatedAnimal.hasIdNumber}
            trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'}
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
          <Text style={styles.editEltLabel}>Appartient à un propriétaire : </Text>
          <Switch
            onValueChange={(newValue) =>
              handleInputChange("isBelonged", newValue)
            }
            value={updatedAnimal.isBelonged}
            trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'}
          />
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.editUnicalSection}>
        <Text style={styles.editUnicalSectionTitle}>Relations : </Text>
        {/* Toggle isFamily */}
        <View style={styles.editElt}>
          <Text style={styles.editEltLabel}>Est lié à une famille : </Text>
          <Switch
            onValueChange={(newValue) =>
              handleInputChange("isFamily", newValue)
            }
            value={updatedAnimal.isFamily}
            trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'}
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
            trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'}
          />
        </View>

        {/* TextInput motherAppId */}
        <View style={styles.editElt}>
          <Text style={styles.editEltLabel}>AppID de la mère : </Text>
          <TextInput
            value={updatedAnimal.motherAppId}
            onChangeText={(text) => handleInputChange("motherAppId", text)}
          />
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.editUnicalSection}>
        <Text style={styles.editUnicalSectionTitle}>Autre : </Text>
        {/* TextInput diseases */}
        <View style={styles.editElt}>
          <Text style={styles.editEltLabel}>Maladies : </Text>
          <TextInput
            value={updatedAnimal.diseases}
            onChangeText={(text) => handleInputChange("diseases", text)}
          />
        </View>

        {/* TextInput particularities */}
        <View style={styles.editElt}>
          <Text style={styles.editEltLabel}>Particularités : </Text>
          <TextInput
            value={updatedAnimal.particularities}
            onChangeText={(text) => handleInputChange("particularities", text)}
          />
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.editUnicalSection}>
        <View style={styles.editEltDocuments}>
          <Text style={styles.editUnicalSectionTitle}>Documents : </Text>
          <EditableDocumentList
            documents={documents}
            setDocuments={setDocuments}
          />
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.editUnicalSection}>
        <View style={styles.btnSectionSuppSave}>

        <TouchableOpacity
            onPress={handleSavePress}
            style={styles.btnSave}
          >
            <Text style={styles.buttonSaveText}>
              SAUVEGARDER
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSuppAnimal}
            style={styles.btnSupp}
          >
            <Text style={styles.buttonSuppText}>
              SUPPRIMER
            </Text>
          </TouchableOpacity>

{/* 
          <Button
            style={styles.btnSupp}
            title="Enregistrer"
            onPress={handleSavePress}
          />
          <Button
            style={styles.btnSave}
            title="Supprimer"
            onPress={handleSuppAnimal}
          /> */}
        </View>
      </View>

      <CustomAlert
        visible={isAlertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
      />
      <ConfirmationModal
        visible={isConfirmationVisible}
        onClose={() => setConfirmationVisible(false)}
        onConfirm={handleConfirmSuppression}
        messageType={'Voulez-vous vraiment supprimer cet animal ?'}
      />
    </ScrollView>
  );
};

const styles = {
  editAnimal: {
    padding: 5,
    flexDirection: "column",
    rowGap: 50,
  },
  editUnicalSection: {
    flexDirection: "column",
    rowGap: 20,
    // backgroundColor: 'blue',
    margin: 5,
  },
  editUnicalSectionTitle: {
    fontSize: 18,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  viewImg: {},
  editElt: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    height: 2,
    backgroundColor: '#000', // change this to fit your design
    // alignSelf: 'start',
    marginVertical: 20, // space above and below the line
    width: '40%', // change this to fit your design
  },
  editEltCheckboxes:{
    marginHorizontal: 15,
    flexDirection: 'column',
  },
  editEltSelects: {
    marginHorizontal: 15,
    flexDirection: 'column'
  },
  editEltDocuments:{
    marginHorizontal: 15,
    flexDirection: 'column'
  },
  editEltLabel:{
    color: '#2F2F2F',
    fontSize: 15,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  textInput: {},
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    rowGap: 20
  },
  btnSupp: {
    backgroundColor: 'red',
  },
  buttonSaveText: {
    padding: 20,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: 'center'
  },
  buttonSuppText: {
    padding: 20,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: 'center'
  },
  btnSave: {
    backgroundColor: 'green'
  },
};

export default EditAnimalDetails;
