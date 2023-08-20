import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch } from "../store/store";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  addAnimal,
  uploadImage,
  uploadFile,
  uploadSingleFile,
  addDocumentToAnimal,
} from "../features/animals/animalSlice";
// import AddCitySectorForm from '../../components/citiesSector/AddCitySector';
import CitySectorAndSectorSelect from "../components/citiesSector/citySectorAndSectorSelect";
// import ColorSelect from "../components/animals/colorSelect";
import EditableImage from "../components/general/EditableImage";
import ColorSelect from "../components/animals/colorSelect";
import {
  Button,
  TextInput,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Image,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import CustomAlert from "../components/general/CustomAlert";
import EditableDocumentList from "../components/general/EditableDocuments";

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

const ObjectForm = (props) => {
  const route = useRoute();
  const { uid } = useSelector((state: RootState) => state.auth);
  //   const { canalId } = props.canalId;
  const { canalId } = route.params;
  // console.log("ASSOCIATION ID : ", canalId)
  const { data: canals } = useSelector(
    (state: RootState) => state.canals
  );
  const canalInfos = canals.find(
    (asso) => asso.id === canalId
  );
  const { data: citiesSector } = useSelector((state: RootState) => state.citiesSector);

  const [name, setName] = useState("");
  const [addedDate, setAddedDate] = useState("");
  const [identification, setIdentification] = useState(false);
  const [numberIdentification, setNumberIdentification] = useState("");
  const [isBelonged, setBelong] = useState(false);
  const [isSterilize, setSterilize] = useState(false);
  const [colors, setColor] = useState([]);
  const [isSick, setDisease] = useState("");
  const [diseases, setDiseases] = useState("");
  const [particularities, setParticularities] = useState("");
  const [citySector, setCitySector] = useState("");
  const [citySectorId, setCitySectorId] = useState(null);
  const [sexAnimal, setSex] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const handleConfirm2 = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setDateIdentification(formattedDate);
    hideDatePicker2();
  };

  const [dateIdentification, setDateIdentification] = useState(null);
  const [isFamily, setFamily] = useState(null);
  const [motherId, setMotherId] = useState(null);
  const [fatherId, setFatherId] = useState(null);
  const [isMother, setIsMother] = useState(null);

  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [documents, setDocuments] = useState([]);

  const dispatch = useAppDispatch();
  const currentDate = new Date();

  // console.log(canalInfos)
  const [showCitySectorForm, setShowCitySectorForm] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let imageUrl = "";
    let documentUrls = [];

    if (imageUri) {
      imageUrl = await uploadImage(imageUri);
    }

    // console.log("IMAGE URL :", imageUrl);
    const data = {
      userCreatorId: uid,
      addedDate: currentDate.toString(),
      canalId: canalId,
      canalName: canalInfos.name,
      name: name,
      sex: sexAnimal,
      age: selectedDate,
      hasIdNumber: identification,
      idNumber: numberIdentification,
      identificationDate: dateIdentification,
      isBelonged: isBelonged,
      isSterilise: isSterilize,
      isSick: isSick,
      colors: colors,
      diseases: diseases,
      particularities: particularities,
      citySectorId: citySectorId,
      citySectorName: citySector,
      image: imageUrl,
      isFamily: isFamily,
      isMother: isMother,
      motherAppId: motherId,
      fatherAppId: fatherId,
    };

    try {
      const createdAnimal = await dispatch(addAnimal(data));
      const animalId = createdAnimal.payload.id;
      if (documents.length > 0) {
        const uploadedDocuments = await Promise.all(
          documents.map(uploadSingleFile)
        );
        await dispatch(
          addDocumentToAnimal({
            animalId: animalId,
            documents: uploadedDocuments,
          })

          
        );

        
        
      }
      setIsAlertVisible(true); 

        // Attendez quelques secondes puis revenez à l'écran précédent
  setTimeout(() => {
    navigation.goBack();
  }, 2000); // 2000 millisecondes soit 2 secondes

    } catch (error) {
      console.error("Error adding object: ", error);
    }
  };

  const handleObjectFormCitySectorChange = async (id, name) => {
    setCitySector(name);
    setCitySectorId(id);
  };


  // const handleRobeChange = (event) => {
  //   if (event.target.checked) {
  //     setColor([...colors, event.target.value]);
  //   } else {
  //     setColor(colors.filter((color) => color !== event.target.value));
  //   }
  // };

  const handleRobeChange = (color: string) => {
    if (colors.includes(color)) {
      setColor(colors.filter((selectedColor) => selectedColor !== color));
    } else {
      setColor([...colors, color]);
    }
  };

  return (
    <View style={styles.container}>
    <ScrollView >
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => {}}>
          <Text style={styles.text}>Retour</Text>
        </TouchableOpacity> */}
        <Text style={styles.title}>Ajouter un nouveau chat</Text>
      </View>
      <View style={styles.addCatSection}>
        <CitySectorAndSectorSelect
          citiesSector={citiesSector}
          selectedCitySectorId={citySectorId}
          onCitySectorChange={handleObjectFormCitySectorChange}
        />
        <View style={styles.form}>
          <Text style={styles.heading}>Informations générales</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Nom :</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Sexe : </Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setSex("Mâle")}
              >
                <View
                  style={[
                    styles.radioDot,
                    sexAnimal === "Mâle" && styles.radioDotSelected,
                  ]}
                />
                <Text style={styles.text}>Mâle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setSex("Femelle")}
              >
                <View
                  style={[
                    styles.radioDot,
                    sexAnimal === "Femelle" && styles.radioDotSelected,
                  ]}
                />
                <Text style={styles.text}>Femelle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setSex("Inconnu")}
              >
                <View
                  style={[
                    styles.radioDot,
                    sexAnimal === "Inconnu" && styles.radioDotSelected,
                  ]}
                />
                <Text style={styles.text}>Inconnu</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Le chat est stérilisé :</Text>
            <Switch value={isSterilize} onValueChange={setSterilize} trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'}/>
          </View>
          {/* <View style={styles.inputGroup}>
            <Text style={styles.text}>Date de naissance :</Text>
            <Button title="Show Date Picker" onPress={showDatePicker} />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <Text>{selectedDate}</Text>
          </View> */}
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Date de naissance : </Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonText}>
                {selectedDate ? selectedDate : "Choisir"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View style={styles.inputGroup && styles.checkboxes}>
            <Text style={styles.text}>Couleurs de la robe :</Text>
            {/* Composant de sélection des couleurs */}
            <View style={{backgroundColor: '#2f2f2f', margin: 10}}>
            <ColorSelect selectedColors={colors} onChange={handleRobeChange} />
            </View>
           
          </View>
          <View style={styles.inputGroup}>
            <View style={styles.imagePicker}>
              <Text style={styles.text}>Image :</Text>
              <View style={{margin: 10}}>
              <EditableImage imageUri={imageUri} setImageUri={setImageUri} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Identification</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Le chat est-il identifié ?</Text>
            <Switch value={identification} onValueChange={setIdentification} trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Date d'identification : </Text>
            <TouchableOpacity
              onPress={showDatePicker2}
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonText}>
                {dateIdentification ? dateIdentification : "Choisir"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible2}
              mode="date"
              onConfirm={handleConfirm2}
              onCancel={hideDatePicker2}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Numéro d'identification :</Text>
            <TextInput
              style={styles.input}
              value={numberIdentification}
              onChangeText={setNumberIdentification}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>
              Le chat a un propriétaire (identifié ou non) :
            </Text>
            <Switch value={isBelonged} onValueChange={setBelong} trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'} />
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Lié à une famille</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Le chat est lié à une famille :</Text>
            <Switch value={isFamily} onValueChange={setFamily} trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Le chat est une mère :</Text>
            <Switch value={isMother} onValueChange={setIsMother} trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>appID de la mère :</Text>
            <TextInput
              style={styles.input}
              value={motherId}
              onChangeText={setMotherId}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>appID du père :</Text>
            <TextInput
              style={styles.input}
              value={fatherId}
              onChangeText={setFatherId}
            />
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Autre</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Le chat semble malade ?</Text>
            <Switch value={isSick} onValueChange={setDisease} trackColor={{true: '#d15e41'}} thumbColor={'#2F2F2F'}/>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Maladies :</Text>
            <TextInput
              style={styles.input}
              value={diseases}
              onChangeText={setDiseases}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.text}>Particularités :</Text>
            <TextInput
              style={styles.input}
              value={particularities}
              onChangeText={setParticularities}
            />
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Documents</Text>
          <View style={styles.inputGroup}>
            {/* <Text style={styles.text}>Ajouter des documents : </Text>
            <TouchableOpacity
              onPress={''}
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonText}>
                Sélectionner
              </Text>
            </TouchableOpacity> */}
            <EditableDocumentList documents={documents} setDocuments={setDocuments} />

          </View>
        </View>

        <View style={styles.handleSubmit}>
        <TouchableOpacity
              onPress={handleSubmit}
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonTextSubmit}>
                Ajouter
              </Text>
            </TouchableOpacity>
            </View>
      </View>

      
      
  
    </ScrollView>
    <CustomAlert visible={isAlertVisible} message={'Animal ajouté avec succès ! '} onClose={() => setIsAlertVisible(false)} />
    </View>
    
  );
};

const styles = {
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: "#2f4f4f",
    // height: 9000
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
    marginTop: 30,
    marginBottom: 30,
    fontFamily: "WixMadeforDisplay-Bold",
  },
  addCatSection: {
    flex: 1,
  },
  form: {
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 2,
  },
  heading: {
    fontSize: 18,
    fontFamily: "WixMadeforDisplay-Bold",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  text: {
    fontFamily: "WixMadeforDisplay-Regular",
  },
  inputGroup: {
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: "center",
    marginBottom: 10,
    // marginRight: 10
  },
  checkboxes: {
    // flexDirection: 'row'
  },
  // imagePicker: {
  //   flexDirection: 'column',
  //   rowGap: 20
  // },
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    // marginRight: 10
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 5,
  },
  radioDotSelected: {
    backgroundColor: "#000",
  },
  datePicker: {
    flex: 1,
  },
  datePickerInput: {
    borderWidth: 0,
    alignItems: "flex-start",
    paddingHorizontal: 5,
    backgroundColor: "#FFF",
    marginLeft: 5,
  },
  datePickerText: {
    fontSize: 16,
  },
  datePickerPlaceholder: {
    fontSize: 16,
    color: "#A0A0A0",
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
  handleSubmit: {
    margin: 20,
    alignItems: 'center',
  },
  buttonTextSubmit: {
    padding: 2,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 20
  }
};

export default ObjectForm;
