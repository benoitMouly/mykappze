import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Modal,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable, Image
} from "react-native";
import { useAppDispatch } from "../../store/store";
import {
  addCity,
  fetchAllSectors,
  fetchCities,
} from "../../features/cities/citySlice";
import { addSector } from "../../features/sectors/sectorSlice";
import { Picker } from "@react-native-picker/picker";
// import { addCity } from '../../features/cities/citySlice';

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

interface RootState {
  associations: DataState<Association>;
  cities: DataState<City>;
  animals: DataState<Animal>;
  sectors: DataState<Sector>;
  auth: {
    isAuthenticated: boolean;
    uid: string;
  };
}

interface AddSectorModalProps {
  associationId: string;
  needsReturn?: boolean;
  navigation?: any;
}

const AddSectorModal: React.FC<AddSectorModalProps> = (props) => {
  const { uid } = useSelector((state: RootState) => state.auth);
  const { data: cities } = useSelector((state: RootState) => state.cities);
  const dispatch = useAppDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [sectorName, setSectorName] = useState("");
  const [cityId, setCityId] = useState(cities[0]?.id || ""); // initial value

  const handleConfirm = () => {
    const data = {
      userId: uid,
      city: cities.find((city) => city.id === cityId)?.name,
      cityId: cityId,
      name: sectorName,
      associationId: props.associationId,
    };

    dispatch(addSector(data))
      .then(() => {
        setModalVisible(false);
        // if (props.needsReturn) {
        //   props.navigation.goBack();
        // }

        dispatch(fetchCities(props.associationId));
        // dispatch(fetchAllSectors());
      })
      .catch((error) => {
        console.error("Error adding city: ", error);
      });
  };

  // console.log(cities);

  const cityOptions = [
    { id: "", label: "Toutes" },
    ...cities.map((city) => ({ id: city.id, label: city.name })),
  ];

  return (
    <View style={styles.centeredView}>
      {/* <Button
        title="Ajouter un secteur"
        onPress={() => setModalVisible(true)}
    /> */}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.sectionBtns_btn}
      >
        {/* <Text style={styles.sectionBtns_btnText}>Ajouter un secteur</Text> */}
        <View style={styles.buttonGroupIcons}>
          <Image
            source={require("../../assets/icons/icon-compass.png")}
            style={styles.buttonIcon}
          />
          {/* <Image
            source={require("../../assets/icons/icon-add.png")}
            style={styles.buttonIcon}
          /> */}
          <Text style={{color: 'white'}}>+</Text>
          </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "center",
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ajouter un nouveau secteur à votre association
            </Text>
            <Text>Sélectionner la ville</Text>
            <View  style={{  alignItems: 'center', borderColor: 'black', borderWidth: 1, borderRadius: 3, width: '60%', backgroundColor: 'transparent'  }}>
              <Picker

                selectedValue={cityId}
                onValueChange={(itemValue) => setCityId(itemValue)}
                style={{ height: 50, width: 200, borderWidth: 1, borderColor: 'black' }}
              >
                {cityOptions.map((city) => (
                  <Picker.Item key={city.id} label={city.label} value={city.id} />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={setSectorName}
              value={sectorName}
              placeholder="Nom du secteur"
            />
            <View style={styles.buttonContainer}>
              <Pressable style={styles.buttonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.textCancel}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.buttonAdd} onPress={handleConfirm}>
                <Text style={styles.textAdd}>Ajouter</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  sectionBtns_btn: {
    flexDirection: 'row',
    columnGap: 8,
    backgroundColor: '#000',
    color: '#FFF',
    padding: 10,
    borderRadius: 2
  },
  sectionBtns_btnText: {
    color: "#FFF",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 10
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 3,
    padding: 10,
    alignItems: "center",
    rowGap: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  buttonCancel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    // elevation: 3,
    backgroundColor: 'black',
  },
  buttonAdd: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    // borderRadius: 4,
    // elevation: 3,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'rgb(47, 79, 79)'

  },
  textCancel: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  textAdd:{
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'rgb(47, 79, 79)',
  },
  buttonGroupIcons: {
    display: "flex",
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: 5,
    width: 20,
    height: 20,
  },
});

export default AddSectorModal;
