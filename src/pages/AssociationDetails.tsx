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
  RefreshControl
} from "react-native";
// import Clipboard from '@react-native-clipboard/clipboard';

import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { fetchCities, fetchAllSectors } from "../features/cities/citySlice";
import { fetchAnimalsByAssociation } from "../features/animals/animalSlice";
import { fetchSectorById } from "../features/sectors/sectorSlice";
import { fetchAssociationUsers } from "../features/associations/associationUsersSlice";
import { useRoute } from "@react-navigation/native";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";
import AnimalList from "../components/animals/animalList";
import AnimalFilters from "../components/animals/animalFilter";
import AddCityModal from "../components/cities/addCityModal";
import AddSectorModal from "../components/sectors/addSectorModal";
import AddCat from "./AddCat";
import { fetchSectors } from "../features/sectors/sectorSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Clipboard from 'expo-clipboard';

// définir les interfaces
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

// Utilisez cette interface dans l'interface RootState
interface RootState {
  associations: DataState<Association>;
  cities: DataState<City>;
  animals: DataState<Animal>;
  associationUsers: DataState<User>;
  sectors: DataState<Sector>;
  auth: {
    isAuthenticated: boolean;
    uid: string;
  };
}

interface RouteParams {
  id: string;
  associationId: string;
  cityId: string;
}

type RootStackParamList = {
  AddCat: undefined;
  CityDetails: undefined;
  EditAssociation: undefined;
};

type AddCatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddCat"
>;

type CityDetailScreen = StackNavigationProp<RootStackParamList, "CityDetails">;

type EditAssociationScreen = StackNavigationProp<
  RootStackParamList,
  "EditAssociation"
>;

const AssociationDetails: React.FC = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AddCatScreenNavigationProp>();
  const navigationCity = useNavigation<CityDetailScreen>();
  const navigationEdit = useNavigation<EditAssociationScreen>();
  const [copiedText, setCopiedText] = useState('');



  const { associationId } = route.params as RouteParams;

  const { isAuthenticated, uid } = useSelector(
    (state: RootState) => state.auth
  );
  const { data: associations, status: associationsStatus } = useSelector(
    (state: RootState) => state.associations
  );
  const { data: cities, status: citiesStatus } = useSelector(
    (state: RootState) => state.cities
  );
  const { data: animals, status: animalsStatus } = useSelector(
    (state: RootState) => state.animals
  );
  const { data: users, status: usersStatus } = useSelector(
    (state: RootState) => state.associationUsers
  );
  // const { data: sectors, status: sectorsStatus } = useSelector(
  //   (state: RootState) => state.sectors
  // );

  const association = associations.find((asso) => asso.id === associationId);

  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [userIsAdmin, setUserRole] = useState<boolean>(false);
  const [isOpenBlock1, setIsOpenBlock1] = useState<boolean>(false);
  const [isOpenBlock2, setIsOpenBlock2] = useState<boolean>(false);
  const [isOpenBlock3, setIsOpenBlock3] = useState<boolean>(false);
  const [isOpenBlock4, setIsOpenBlock4] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [sectorsList, setSectors] = useState<Sector[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const archiveType = "association";

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


  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler une requête de réseau
    wait(2000).then(
      () => {setRefreshing(false), dispatch(fetchAnimalsByAssociation(associationId));});
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
  // const archiveType = linkedCityId;

  useEffect(() => {
    if (isAuthenticated) {

      dispatch(fetchCities(associationId));
      dispatch(fetchAnimalsByAssociation(associationId));
      dispatch(fetchAssociationUsers(associationId));
    }
  }, [associationId, isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        // console.log(association)
        const sectores = await fetchAllSectors(cities, dispatch);
        setSectors(sectores);
      }
    };

    fetchData();
    console.log(associationId);
  }, [associationId, cities, isAuthenticated]);

  useEffect(() => {
    users.forEach((user) => {
      if (user.id === uid) {
        setUserRole(user.isAdmin);
      }
    });
  }, [users]);

  // if (sectorsStatus === 'loading' || animalsStatus === 'loading' || associationsStatus === 'loading' || usersStatus === 'loading' || citiesStatus === 'loading') {
  //     return <LoadingPage />;
  // }


  const copyToClipboard = async (value) => {
    await Clipboard.setStringAsync(value);
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <View>
      <ScrollView style={styles.container}   refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
        <View style={styles.header}>
          <View style={styles.header1st}>
            <Image source={{ uri: association?.image }} style={styles.image} />
            <Text style={styles.title}>{association?.name}</Text>
            <View style={styles.settingsBtn}>
              <TouchableOpacity
                onPress={() =>
                  navigationEdit.navigate("EditAssociation", {
                    associationId: association?.id,
                  })
                }
                style={styles.sectionBtns_btnSettings}
              >
                <Icon name={"settings-outline"} size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sectionShare}>
          
            <Text style={styles.sectionShare_title}>Partager le canal : </Text>
            <TouchableOpacity
              onPress = {() => {copyToClipboard(association.id)}}
              style={styles.sectionShare_button}
            >
              <Text style={styles.sectionShare_buttonText} selectable={true} >
                {isCopied ? ('Copié !') : (association?.id)}
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
              <Text>{association?.name}</Text>
              <Text>{association?.email}</Text>
              <Text>{association?.city}</Text>
              <Text>{association?.postalCode}</Text>
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
              Villes Couvertes : ({cities.length})
            </Text>
            <Icon
              name={isOpenBlock3 ? "chevron-down" : "chevron-forward"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          {isOpenBlock3 && (
            <View style={styles.sectionCity}>
              {cities.map((city) => (
                <View style={styles.cityList} key={city.id}>
                  <TouchableOpacity
                    onPress={() =>
                      navigationCity.navigate("CityDetails", {
                        associationId: associationId,
                        cityId: city?.id,
                      })
                    }
                    style={styles.sectionBtns_btnCity}
                  >
                    <Text style={styles.sectionTitleCity}>{city?.name}</Text>
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
          sectorized={sectorsList}
          archiveType={archiveType}
        />
        {/* </SafeAreaView> */}
        <Text>Pull down to see RefreshControl indicator</Text>
      </ScrollView>
      <View style={styles.footer}>
        <AddCityModal
          style={styles.sectionBtns_btn}
          associationId={association?.id}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AddCat", { associationId: association?.id })
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
            <Text style={{color: 'white'}}>+</Text>
          </View>
        </TouchableOpacity>
        <AddSectorModal
          style={styles.sectionBtns_btn}
          associationId={association?.id}
        />
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
    width: '60%'
    
  },
  sectionShare_buttonText: {
    color: "#000",
    fontFamily: "WixMadeforDisplay-Regular",
    marginBottom: 5,
    width: '100%',
    textAlign: 'center'
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
  sectionCity: {
    flexDirection: "column",
    rowGap: 5,
    // alignItems: 'center',
    justifyContent: "center",
  },
  cityList: {
    maxWidth: 200,
    // backgroundColor: 'blue'
  },
  sectionBtns_btnCity: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#000",
    color: "#FFF",
    padding: 10,
    borderRadius: 2,
  },
  sectionTitleCity: {
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
    marginTop: 10
  },
  settingsBtn: {
    position: 'absolute',
    top: 0,
    right: 0
  }
});

export default AssociationDetails;

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
