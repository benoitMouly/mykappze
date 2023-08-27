import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnimalsByCanal } from '../../features/animals/animalSlice';
import { fetchCanalUsers } from '../../features/canals/canalUsersSlice';

// Define the navigation type
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CanalDetails: { canalId: string }; // Add this line
};

type CanalDetailsScreen = StackNavigationProp<
  RootStackParamList,
  "CanalDetails"
>;

const CanalCard = ({ canal }) => {
  const navigation = useNavigation<CanalDetailsScreen>();
  const [localAnimals, setLocalAnimals] = useState([]);
  const [localUserCanal, setLocalUsersCanal] = useState([]);
  const { uid } = useSelector((state) => state.auth);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: animals } = useSelector((state) => state.animals)
  const isAdmin = canal.role && canal.role.find((item) => item.uid === uid)?.isAdmin;
  const dispatch = useDispatch();

  const handlePress = () => {
    navigation.navigate("CanalDetails", {
      // id: canal.id,
      canalId: canal.id,
    });
  };

  
  useEffect(() => {
    if (isAuthenticated) {
        dispatch(fetchAnimalsByCanal(canal.id)).then((result) => {
            setLocalAnimals(result.payload);
        });
        dispatch(fetchCanalUsers(canal.id)).then((result) => {
            setLocalUsersCanal(result.payload)
        })
    }
}, [canal, dispatch, canal.id, isAuthenticated]);


  return (
    <View style={styles.container}>
      <TouchableOpacity  style={styles.touchable} onPress={handlePress}>
      {canal.image ? (
        <Image style={styles.image} source={{ uri: canal.image }} />
      ) : (
        <Image
          style={styles.image}
          source={require("../../assets/kappze_logo_without_square_bw.png")}
        />
      )}
      <View style={{flexDirection: 'row', alignItems: 'center', columnGap: 5, marginBottom: 20}}><Text style={styles.textName}>{canal.name}</Text>
      {isAdmin === true ? (
        <Icon name ="ribbon" size={20}  color="#d15e41" />
      ) : (null)}
      </View>
      <View style={styles.animalsUsersIcon}>
        <View style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}><Icon name="paw-outline" size={24} color="#2f4f4f" /><Text style={styles.textNumber}>{localAnimals.length}</Text></View>
        <View style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}><Icon name="people-outline" size={24} color="#2f4f4f" /><Text style={styles.textNumber}>{localUserCanal.length}</Text></View>
      </View>

      <View style={styles.canalInfos}>
        <View style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}><Icon name="location-sharp" size={24} color="#2f4f4f" /><Text style={styles.textInfo}>{canal.city}</Text></View>
        <View style={{flexDirection: 'row', alignItems: 'center', columnGap: 5, width: '100%'}}><Icon name="mail-sharp" size={24} color="#2f4f4f" /><Text  style={styles.textInfo} ellipsizeMode='tail' numberOfLines={1} >{canal.email}</Text></View>
        <View style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}><Icon name="call-sharp" size={24} color="#2f4f4f" /><Text style={styles.textInfo}>{canal.phoneNumber}</Text></View>
      </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    borderRadius: 2,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // elevation: 2,
    marginBottom: 20,
    padding: 5,
    alignItem: "center",
  },
  touchable: {
    flexDirection: 'column',
    
    alignItems: "center"
  },
  textName: {
    // marginBottom: 10,
    fontFamily: "WixMadeforDisplay-Bold",
    alignSelf: "center",
    fontSize: 17,
    color : '#2f4f4f'
  },
  textNumber: {
    // marginBottom: 10,
    fontFamily: "WixMadeforDisplay-Bold",
    alignSelf: "flex-start",
    fontSize: 13
  },
  textInfo: {
    fontSize: 13,
    fontFamily: "WixMadeforDisplay-Regular",
    width:100

    // alignSelf: "flex-start",
  },
  // text: {
  //   marginBottom: 10,
  //   fontFamily: "WixMadeforDisplay-Bold",
  //   alignSelf: "center",
  // },
  image: {
    width: 100, // Remplacez par les dimensions souhaitées
    height: 100, // Remplacez par les dimensions souhaitées
    marginBottom: 10,
  },
  button: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 2,
    justifyContent: "space-between",
    alignItems: 'center',
    flexDirection: "row",
    width: "100%",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "WixMadeforDisplay-Bold",
  },
  animalsUsersIcon: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 40,
  },
  canalInfos: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 20,
    width: '100%',
  },
});

export default CanalCard;
