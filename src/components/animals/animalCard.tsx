import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

interface AnimalProps {
  animal: {
    name: string;
    id: string;
    image?: string;
    sex: string;
    isMother: boolean;
    cityName: string;
    sectorName: string;
  };
}

const AnimalCard: React.FC<AnimalProps> = (props) => {

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image style={styles.image} source={props.animal.image ? { uri: props.animal.image } : require("../../assets/kappze_logo_circle_noir_roigne.png")} />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>Nom : {props.animal.name}</Text>
          <Text style={styles.info}>{props.animal.sex} {props.animal.isMother ? ' / Mère' : ''}</Text>
          <Text style={styles.info}>Ville: {props.animal.cityName}</Text>
          <Text style={styles.info}>Secteur: {props.animal.sectorName}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => console.log("Voir")}>
        <Text style={styles.buttonText}>Voir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    width: '50%',
    paddingHorizontal: 10,
  },
  card: {
    // borderWidth: 2,
    // borderColor: '#000',
    borderRadius: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderRadius: 4,
    overflow: 'hidden'
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AnimalCard;
