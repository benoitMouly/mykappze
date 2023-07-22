import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch } from "../store/store";
import {
  fetchAnimalById,
  fetchMotherById,
  deleteAnimal,
} from "../features/animals/animalSlice";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import AnimalFilters from "../components/animals/animalFilter";
import { fetchAnimalsByMother } from "../features/animals/parentAnimalSlice";

const AnimalDetails = ({ route }) => {
  const { animalId } = route.params;
  const [currentAnimalId, setCurrentAnimalId] = useState(null);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [motherCatId, setMotherCat] = useState("");
  const animals = useSelector((state) => state.animals.data); // Remplacer par le sélecteur approprié
  // const animal = useSelector((state) => state.animals.selectedAnimal);
  const animal = animals.find((animal) => animal.id === animalId);
  const dispatch = useAppDispatch();

  if(!animal) {
    return <Text>Loading...</Text>
  }

  const navigation = useNavigation();

  const goToEditPage = () => {
    navigation.navigate("EditAnimalDetails", { animalId: animalId });
  };

  // Initialize blocks states
  const [blocksOpen, setBlocksOpen] = useState({
    infoGeneral: false,
    identification: false,
    relations: false,
    autre: false,
    documents: false,
  });

  useEffect(() => {
    if (animalId !== currentAnimalId) {
      dispatch(fetchAnimalById(animalId));
      setCurrentAnimalId(animalId);
    }
  }, [animalId, dispatch]);

  useEffect(() => {
    if (animal.id && animal.motherAppId) {
      dispatch(fetchMotherById(animal.motherAppId));
      setMotherCat(animal.motherAppId);
      setFilteredAnimals(
        animals.filter(
          (animale) =>
            (animale.motherAppId === animal.motherAppId ||
              animale.id == animal.motherAppId) &&
            animale.id !== animal.id
        )
      );
    } else if (animal.id && animal.isMother && !animal.motherAppId) {
      dispatch(fetchAnimalsByMother(animal.id));
      setFilteredAnimals(
        animals.filter((animal) => animal.motherAppId === animal.id)
      );
      setMotherCat("");
    } else {
      setMotherCat("");
    }
  }, [dispatch, currentAnimalId, animal, motherCatId]);

  // Function to handle blocks toggle
  const toggleBlock = (blockName) => {
    setBlocksOpen((prev) => ({
      ...prev,
      [blockName]: !prev[blockName],
    }));
  };

  // Function to render the correct icon depending on the block state
  const renderIcon = (blockName) => {
    const iconName = blocksOpen[blockName] ? "chevron-up" : "chevron-down";
    return <Icon name={iconName} size={20} color="#000" />;
  };

  // Si l'animal n'est pas encore chargé, afficher un texte de chargement
  if (!animal) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      {/* Bloc green */}
      <View>
        <View style={styles.header1st}>
          <TouchableOpacity onPress={goToEditPage}>
            <Icon name="edit" size={24} color="#000" />
          </TouchableOpacity>
          <View>
            <Image source={{ uri: animal.image }} style={styles.image} />
          </View>
          <View>
            <Text style={styles.title}>{animal ? animal.name : null}</Text>
            <Text style={styles.subtitle}>
              Sexe: {animal ? animal.sex : null}
            </Text>
            <Text style={styles.subtitle}>
              APP ID: {animal ? animal.id : null}
            </Text>
            <Text style={styles.subtitle}>
              Age: {animal ? animal.age : null}
            </Text>
            {/* <EditableTextField /> */}
          </View>
        </View>
      </View>

      {/* Bloc General d'infos */}
      <View style={styles.infos}>
        {/* Bloc General 1 */}
        <TouchableOpacity onPress={() => toggleBlock("infoGeneral")}>
          <View style={styles.blocInfos}>
            <View style={styles.blocTitle}>
              <Text style={styles.blocInfosTitle}>
                Informations générales :
              </Text>
              {renderIcon("infoGeneral")}
            </View>

            {blocksOpen.infoGeneral && (
              <>
                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Association : </Text>
                  <Text>
                    {animal.associationName ? animal.associationName : null}
                  </Text>
                </View>
                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Ville : </Text>
                  <Text>{animal.cityName ? animal.cityName : null}</Text>
                </View>
                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Secteur : </Text>
                  <Text>{animal.sectorName ? animal.sectorName : null}</Text>
                </View>

                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Couleurs :</Text>
                  {animal.colors && animal.colors.length > 0 && (
                    <>
                      {animal.colors.map((color, index) => (
                        <Text key={index}>{color}</Text>
                      ))}
                    </>
                  )}
                </View>

                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Est stérilisé : </Text>
                  <Text>{animal.isSterilized ? "Oui" : "Non"}</Text>
                </View>

                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Semble malade : </Text>
                  <Text>{animal.isSick ? "Oui" : "Non"}</Text>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Bloc General 2 */}
        <TouchableOpacity onPress={() => toggleBlock("identification")}>
          <View style={styles.blocInfos}>
            <View style={styles.blocTitle}>
              <Text style={styles.blocInfosTitle}>Identification :</Text>
              {renderIcon("identification")}
            </View>

            {blocksOpen.identification && (
              <>
                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Est identifié : </Text>
                  <Text>{animal.isIdentificated ? "Oui" : "Non"}</Text>
                </View>

                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>
                    Date d'identification :{" "}
                  </Text>
                  <Text>{animal.identificationDate ? animal.identificationDate : null}</Text>
                </View>

                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>
                    Appartient à un propriétaire :{" "}
                  </Text>
                  <Text>{animal.isBelonged ? "Oui" : "Non"}</Text>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Bloc General 3 */}
        <TouchableOpacity onPress={() => toggleBlock("relations")}>
          <View style={styles.blocInfos}>
            <View style={styles.blocTitle}>
              <Text style={styles.blocInfosTitle}>Relations :</Text>
              {renderIcon("relations")}
            </View>

            {blocksOpen.relations && (
              <>
                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>
                    Est lié à une famille :{" "}
                  </Text>
                  <Text>{animal.isFamily ? "Oui" : "Non"}</Text>
                </View>

                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Est une mère : </Text>
                  <Text>{animal.isMother ? "Oui" : "Non"}</Text>
                </View>

                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>AppID de la mère : </Text>
                  <Text>{animal.motherAppId}</Text>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Bloc General 4 */}
        <TouchableOpacity onPress={() => toggleBlock("autre")}>
          <View style={styles.blocInfos}>
            <View style={styles.blocTitle}>
              <Text style={styles.blocInfosTitle}>Autre :</Text>
              {renderIcon("autre")}
            </View>

            {blocksOpen.autre && (
              <>
                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Maladies : </Text>
                  <Text>{animal.diseases}</Text>
                </View>

                <View style={styles.unicalInfo}>
                  <Text style={styles.infosLabel}>Particularités : </Text>
                  <Text>{animal.particularities}</Text>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Bloc General 5 */}
        <TouchableOpacity onPress={() => toggleBlock("documents")}>
          <View style={styles.blocInfos}>
            <View style={styles.blocTitle}>
              <Text style={styles.blocInfosTitle}>Documents :</Text>
              {renderIcon("documents")}
            </View>

            {(blocksOpen.documents && animal.documents) && (
              <>
                {animal.documents.map((document, index) => (
                  <Text key={index}>{document.name}</Text>
                ))}
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View>
        {animal.isMother ? (
          <>
            <Text>Descendance : </Text>
            <AnimalFilters animals={filteredAnimals} />
          </>
        ) : animal.motherAppId ? (
          <>
            <Text>Famille : </Text>
            <AnimalFilters animals={filteredAnimals} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default AnimalDetails;
// function setCurrentAnimalId(id: any) {
//   throw new Error("Function not implemented.");
// }

const styles = {
  header1st: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 40,
    backgroundColor: "#2F4F4F",
    paddingTop: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  subtitle: {
    color: "#FFF",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 50,
  },
  blocTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infos: {
    // marginLeft: 20,
    // marginRight: 20,
    backgroundColor: "#2F4F4F",
  },
  infosLabel: {
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    color: "grey",
  },
  blocInfos: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 4,
  },
  blocInfosTitle: {
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    marginBottom: 10,
  },
  unicalInfo: {
    flexDirection: "row",
  },
};
