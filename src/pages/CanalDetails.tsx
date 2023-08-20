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

type CitySectorDetailScreen = StackNavigationProp<RootStackParamList, "CitySectorDetails">;

type EditCanalScreen = StackNavigationProp<
  RootStackParamList,
  "EditCanal"
>;

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

  const canal = canals.find((asso) => asso.id === canalId);

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
    <View>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.header1st}>
          {canal.image ? (
        <Image style={styles.image} source={{ uri: canal.image }} />
      ) : (
        <Image
          style={styles.image}
          source={require("../assets/kappze_logo_without_square_bw.png")}
        />
      )}
            <Text style={styles.title}>{canal?.name}</Text>
            <View style={styles.settingsBtn}>
              {userIsAdmin && (
                <TouchableOpacity
                  onPress={() =>
                    navigationEdit.navigate("EditCanal", {
                      canalId: canal?.id,
                    })
                  }
                  style={styles.sectionBtns_btnSettings}
                >
                  <Icon name={"settings-outline"} size={24} color="#fff" />
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

        <View style={styles.containerSection}>
          <TouchableOpacity
            onPress={() => setIsOpenBlock1(!isOpenBlock1)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>Informations générales</Text>
            <Icon
              name={isOpenBlock1 ? "chevron-down" : "chevron-forward"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          {isOpenBlock1 && (
            <View style={styles.section}>
              <Text>{canal?.name}</Text>
              <Text>{canal?.email}</Text>
              <Text>{canal?.citySector}</Text>
              <Text>{canal?.postalCode}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => setIsOpenBlock2(!isOpenBlock2)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>Membres : ({users.length})</Text>
            <Icon
              name={isOpenBlock2 ? "chevron-down" : "chevron-forward"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          {isOpenBlock2 && (
            <View style={styles.section}>
              {users.map((user) => (
                <View key={user.id}>
                  <Text>{user.name}</Text>
                  <Text>{user.email}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={() => setIsOpenBlock3(!isOpenBlock3)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>
              Secteurs couverts : ({citiesSector.length})
            </Text>
            <Icon
              name={isOpenBlock3 ? "chevron-down" : "chevron-forward"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          {isOpenBlock3 && (
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
                    <Text style={styles.sectionTitleCitySector}>{citySector?.name}</Text>
                    <Icon name={"chevron-forward"} size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* <SafeAreaView style={{flex: 1}}> */}
        {/* <View style={styles.line} /> */}

        <AnimalFilters
          animals={animals}
          archiveType={archiveType}
        />
        {/* </SafeAreaView> */}
        <Text>Pull down to see RefreshControl indicator</Text>
      </ScrollView>
      <View style={styles.footer}>
        <AddCitySectorModal
          style={styles.sectionBtns_btn}
          canalId={canal?.id}
        />
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
            {/* <Image
              source={require("../assets/icons/icon-add.png")}
              style={styles.buttonIcon}
            /> */}
            <Text style={{ color: "white" }}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    height: "100%",
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
    padding: 5,
    width: "60%",
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
    backgroundColor: "#000",
    color: "#FFF",
    padding: 10,
    borderRadius: 2,
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
    width: 20,
    height: 20,
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
    backgroundColor: "#000",
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
  settingsBtn: {
    position: "absolute",
    top: 0,
    right: 0,
  },
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
