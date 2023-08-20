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
  Pressable,
  Image
} from "react-native";
import { useAppDispatch } from "../../store/store";
import { addCitySector } from "../../features/citiesSector/citySectorSlice";
// import { addCitySector } from '../../features/citiesSector/citySectorSlice';

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
  auth: {
    isAuthenticated: boolean;
    uid: string;
  };
}

const AddCitySectorModal = (props) => {
  const { uid } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [citySectorName, setCitySectorName] = useState("");

  const handleConfirm = () => {
    const data = {
      userId: uid,
      name: citySectorName,
      canalId: props.canalId,
    };

    dispatch(addCitySector(data))
      .then(() => {
        setModalVisible(false);
        if (props.needsReturn) {
          props.navigation.goBack();
        }
      })
      .catch((error) => {
        console.error("Error adding citySector: ", error);
      });
  };

  return (
    <View style={styles.centeredView}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.sectionBtns_btn}
      >
        <View style={styles.buttonGroupIcons}>
          <Image
            source={require("../../assets/icons/icon-city.png")}
            style={styles.buttonIcon}
          />
          <Text style={{color : 'white'}}>+</Text>
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: "center" }}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ajouter une nouvelle ville à votre canal
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setCitySectorName}
              value={citySectorName}
              placeholder="Nom de la ville"
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
  sectionBtns_btnText:{
    color: '#FFF',
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

export default AddCitySectorModal;
