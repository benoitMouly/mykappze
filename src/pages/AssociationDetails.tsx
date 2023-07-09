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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { fetchCities, fetchAllSectors } from "../features/cities/citySlice";
import { fetchAnimalsByAssociation } from "../features/animals/animalSlice";
import { fetchAssociationUsers } from "../features/associations/associationUsersSlice";
import { useRoute } from "@react-navigation/native";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";
import AnimalList  from "../components/animals/animalList";
import AnimalFilters from "../components/animals/animalFilter";

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
}

const AssociationDetails: React.FC = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();

  const { id, associationId } = route.params as RouteParams;

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
  const { data: sectors, status: sectorsStatus } = useSelector(
    (state: RootState) => state.sectors
  );

  const association = associations.find((asso) => asso.id === associationId);

  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [userIsAdmin, setUserRole] = useState<boolean>(false);
  const [isOpenBlock1, setIsOpenBlock1] = useState<boolean>(true);
  const [isOpenBlock2, setIsOpenBlock2] = useState<boolean>(false);
  const [isOpenBlock3, setIsOpenBlock3] = useState<boolean>(false);
  const [isOpenBlock4, setIsOpenBlock4] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [sectorsList, setSectors] = useState<Sector[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
      // console.log("ID : ", associationId);

      dispatch(fetchCities(associationId));
      dispatch(fetchAnimalsByAssociation(associationId));
      dispatch(fetchAssociationUsers(associationId));


    }
  }, [association, dispatch, id, isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
        if (isAuthenticated) {
            const sectores = await fetchAllSectors(cities, dispatch);
            setSectors(sectores);
            
        }
    };

    fetchData();
}, [association, cities, dispatch, id, isAuthenticated]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (isAuthenticated) {
  //       console.log(association)
  //       const sectors = await fetchAllSectors(cities, dispatch);
  //       setSectors(sectors);
  //     }
  //   };

  //   fetchData();
  // }, [association, cities, dispatch, id, isAuthenticated]);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Réinitialiser après 2 secondes
    } catch (err) {
      console.error("Erreur de copie", err);
    }
  };

  return (
    <ScrollView  style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header1st}>
          <Image source={{ uri: association?.image }} style={styles.image} />
          <Text style={styles.title}>{association?.name}</Text>
        </View>
        <View style={styles.sectionShare}>
          <Text style={styles.sectionShare_title}>Partager le canal : </Text>
          <TouchableOpacity
            onPress={() => handleCopy}
            style={styles.sectionShare_button}
          >
            <Text style={styles.sectionShare_buttonText}>
              {association?.id}
            </Text>
          </TouchableOpacity>
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
          <Text style={styles.sectionTitle}>Villes Couvertes : ({ cities.length })</Text>
          <Icon
            name={isOpenBlock3 ? "chevron-down" : "chevron-forward"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
        {isOpenBlock3 && (
          <View style={styles.section}>
            {cities.map((city) => (
              <View key={city.id}>
                <Text>{city.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* <SafeAreaView style={{flex: 1}}> */}
        <AnimalFilters animals={animals} sectorized={sectorsList}/>
        {/* </SafeAreaView> */}

    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    heigt: "100%"
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
  },
  sectionShare_button: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 5,
  },
  sectionShare_buttonText: {
    color: "#000",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
  },
  title: {
    // fontSize: 18,
    // fontWeight: 'bold',
    color: "#FFF",
    fontSize: 32,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },

  containerSection: {
    padding: 10
  },

  section: {
    marginBottom: 20,
    padding: 25,
    paddingTop: 0
    // borderWidth: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    paddingBottom: 5
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
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
