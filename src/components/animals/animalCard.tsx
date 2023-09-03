import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const windowWidth = Dimensions.get("window").width;

interface AnimalProps {
  animal: {
    name: string;
    id: string;
    image?: string;
    sex: string;
    isMother: boolean;
    citySectorName: string;
  };
}
// Define the navigation type
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AnimalDetails: { animalId: string }; // Add this line
};

type CanalDetailsScreen = StackNavigationProp<
  RootStackParamList,
  "AnimalDetails"
>;

const AnimalCard: React.FC<AnimalProps> = (props) => {
  const navigation = useNavigation<CanalDetailsScreen>();

  const handlePress = () => {
    navigation.navigate("AnimalDetails", {
      animalId: props.animal.id,
    });
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.card}>
          <Image
            style={styles.image}
            source={
              props.animal.image
                ? { uri: props.animal.image.url }
                : require("../../assets/kappze_logo_without_square_bw.png")
            }
          />
          <View style={styles.infoContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* <Text style={styles.title}>{props.animal?.name ? props.animal.name : props.animal.id}
            </Text> */}

              {props.animal?.name ? (
                <Text style={styles.title}>{props.animal.name}</Text>
              ) : (
                <Text style={styles.id}>{props.animal.id}</Text>
              )}
              {props.animal.sex === "Mâle" ? (
                <Icon name={"male-outline"} size={20} color="#000" />
              ) : props.animal.sex === "Femelle" ? (
                <Icon name={"female-outline"} size={20} color="#000" />
              ) : (
                <Icon name={"help-outline"} size={20} color="#000" />
              )}
            </View>
            <View
              style={{ flexDirection: "column", rowGap: 10, marginVertical: 5 }}
            >
              <View style={styles.buttonGroupIcons}>
                <Image
                  source={require("../../assets/icons/icon-city.png")}
                  style={styles.buttonIcon}
                />
                <Text>{props.animal.citySectorName}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <Icon name={"arrow-forward-outline"} size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    width: "50%",
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 3,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 4,
    overflow: "hidden",
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 15,
    marginBottom: 5,
    fontFamily: "WixMadeforDisplay-Bold",
  },
  id: {
    fontSize: 10,
    padding: 5,
  },
  info: {
    fontSize: 14,
    marginBottom: 2,
    fontFamily: "WixMadeforDisplay-Regular",
  },
  button: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonGroupIcons: {
    display: "flex",
    flexDirection: "row",
  },
  buttonIcon: {
    marginRight: 5,
    width: 20,
    height: 20,
    backgroundColor: "black",
    borderRadius: 40,
  },
});

export default AnimalCard;
