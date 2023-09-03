import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Button,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AnimalList from "./animalList";
import { getFilteredAnimals } from "./getFilteredAnimal";
import { useSelector } from "react-redux";
import { COLORS } from "../../data/colors";
import Icon from "react-native-vector-icons/Ionicons";

interface FilterValues {
  text: string;
  selectCitySector: string;
}


interface Animal {
  id: string;
  name: string;
  image?: string;
  sex: string;
  isMother: boolean;
  citySectorName: string;
}


interface CitySector {
  id: string;
  canalid: string;
  name: string;
  userId: string;
}

interface AnimalFiltersProps {
  animals: Animal[];
  archiveType: string;
}

interface DataState<T> {
  data: T[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  // Ajoutez ici d'autres champs si nécessaire
}

// Utilisez cette interface dans l'interface RootState
interface RootState {
  citiesSector: DataState<CitySector>;
  animals: DataState<Animal>;
  auth: {
    isAuthenticated: boolean;
    uid: string;
  };
}

const AnimalFilters: React.FC<AnimalFiltersProps> = ({
  animals,
  archiveType,
}) => {
  const { data: citiesSector, status: citiesSectorStatus } = useSelector(
    (state: RootState) => state.citiesSector
  );

  const [selectedCitySector, setSelectedCitySector] = useState("");
  const [selectedCitySectorId, setSelectedCitySectorId] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState("");
  const [filterByDisease, setFilterByDisease] = useState(null);
  const [filterBySterilization, setFilterBySterilization] = useState(null);
  const [filterByIdentification, setFilterByIdentification] = useState(null);
  const [filterByOwner, setFilterByOwner] = useState(null);
  const [filterBySex, setFilterBySex] = useState("");
  const [filterByName, setFilterByName] = useState("");
  const [filterByMom, setFilterByMom] = useState(null);
  const [filters, setFilters] = useState<FilterValues>({
    text: "",
    selectCitySector: "option1",
  });

  const handleNameChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const citySectorOptions = [
    { id: "", label: "Tous" },
    ...citiesSector.map((citySector) => ({ id: citySector.id, label: citySector.name })),
  ];

  const handleCitySectorChange = (value: string) => {
    const selectedCitySector = citySectorOptions.find((citySector) => citySector.id === value);
    if (selectedCitySector) {
      setSelectedCitySectorId(selectedCitySector.id);
      setSelectedCitySector(selectedCitySector.label);
    } else {
      setSelectedCitySectorId(null); // Réinitialisez la valeur sélectionnée
      setSelectedCitySector(""); // Réinitialisez le label sélectionné
    }
  };

  const handleColorChange = (value: string) => {
    setSelectedColor(value);
  };

  const handleDiseaseChange = (value: boolean) => {
    setFilterByDisease(value);
  };

  const handleSexChange = (value: string) => {
    setFilterBySex(value);
  };

  const handleMomChange = (value: boolean) => {
    setFilterByMom(value);
  };

  const handleSterilizationChange = (value: boolean) => {
    setFilterBySterilization(value);
  };

  const handleIdentificationChange = (value: boolean) => {
    setFilterByIdentification(value);
  };

  const handleOwnerChange = (value: boolean) => {
    setFilterByOwner(value);
  };

  // Filtrer les animaux par le nom.
  const filteredAnimals = getFilteredAnimals(
    animals,
    selectedCitySector,
    selectedColor,
    filterByDisease,
    filterBySterilization,
    filterByIdentification,
    filterByOwner,
    filterBySex,
    filterByMom,
    filters.text // Utiliser la valeur du champ de texte pour filtrer par le nom.
  );

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView>
      {/* <View style={styles.filterContainer}>
        <Button
          title="Filtrer"
          onPress={() => setModalVisible(true)}
        />
      </View> */}

      <View style={styles.sectionBtns}>
        <TouchableOpacity
          style={styles.sectionBtns_btn}
          onPress={() => setModalVisible(true)}
        >
          {/* <Text style={styles.sectionBtns_btnText}>Filter</Text> */}
          {/* <ion-icon name="options-outline"></ion-icon> */}
          <Icon name={"options-outline"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            justifyContent: "center",
          }}
        >
          <ScrollView style={styles.modalView}>
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Nom </Text>
              <TextInput
                style={styles.filterInput}
                value={filters.text}
                onChangeText={(value) => handleNameChange("text", value)}
              />
            </View>
            {archiveType === "canal" ? (
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Secteur </Text>
                <Picker
                  style={{ height: 50, width: 150 }}
                  selectedValue={selectedCitySectorId}
                  onValueChange={handleCitySectorChange}
                >
                  {citySectorOptions.map((citySector) => (
                    <Picker.Item
                      key={citySector.id}
                      label={citySector.label}
                      value={citySector.id}
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <></>
            )}



            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Robe </Text>
              <Picker
                style={{ height: 50, width: 150 }}
                selectedValue={selectedColor}
                onValueChange={handleColorChange}
              >
                <Picker.Item label="Toutes" value={""} />
                {COLORS.map((color) => (
                  <Picker.Item key={color} label={color} value={color} />
                ))}
              </Picker>
            </View>

            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Sexe </Text>
              <Picker
                style={{ height: 50, width: 150 }}
                selectedValue={filterBySex}
                onValueChange={handleSexChange}
              >
                <Picker.Item label="Tous" value={""} />
                <Picker.Item label="Mâle" value={"Mâle"} />
                <Picker.Item label="Femelle" value={"Femelle"} />
                <Picker.Item label="Inconnu" value={"Inconnu"} />
              </Picker>
            </View>

            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Stérilisés </Text>
              <Picker
                style={{ height: 50, width: 150 }}
                selectedValue={filterBySterilization}
                onValueChange={handleSterilizationChange}
              >
                <Picker.Item label="-" value={null} />
                <Picker.Item label="Oui" value={true} />
                <Picker.Item label="Non" value={false} />
              </Picker>
            </View>

            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Maladies </Text>
              <Picker
                style={{ height: 50, width: 150 }}
                selectedValue={filterByDisease}
                onValueChange={handleDiseaseChange}
              >
                <Picker.Item label="-" value={null} />
                <Picker.Item label="Oui" value={true} />
                <Picker.Item label="Non" value={""} />
              </Picker>
            </View>

            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Identifié </Text>
              <Picker
                style={{ height: 50, width: 150 }}
                selectedValue={filterByIdentification}
                onValueChange={handleIdentificationChange}
              >
                <Picker.Item label="-" value={null} />
                <Picker.Item label="Oui" value={true} />
                <Picker.Item label="Non" value={""} />
              </Picker>
            </View>

            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>
                Appartient à un propriétaire 
              </Text>
              <Picker
                style={{ height: 50, width: 150 }}
                selectedValue={filterByOwner}
                onValueChange={handleOwnerChange}
              >
                <Picker.Item label="-" value={null} />
                <Picker.Item label="Oui" value={true} />
                <Picker.Item label="Non" value={""} />
              </Picker>
            </View>

            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Est une mère </Text>
              <Picker
                style={{ height: 50, width: 150 }}
                selectedValue={filterByMom}
                onValueChange={handleMomChange}
              >
                <Picker.Item label="-" value={null} />
                <Picker.Item label="Oui" value={true} />
                <Picker.Item label="Non" value={""} />
              </Picker>
            </View>
            <View style={styles.sectionBtns}>
              <TouchableOpacity
                style={styles.sectionBtns_btnCheck}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.sectionBtns_btnText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <AnimalList animals={filteredAnimals} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 5
  },
  filterLabel: {
    flex: 1,
    fontWeight: "bold",
  },
  filterInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 3,
    padding: 10,
    // alignItems: "center",
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
  sectionBtns: {
    flexDirection: "column",
    alignItems: "flex-end",
    margin: 20,
  },
  sectionBtns_btn: {
    flexDirection: "row",
    // justifyContent: "flex-end",
    columnGap: 8,
    backgroundColor: "transparent",
    color: "#FFF",
    borderWidth: 2,
    borderColor: '#fff',
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 2,
    // width: 100,
  },
  sectionBtns_btnCheck: {
    flexDirection: "row",
    // justifyContent: "flex-end",
    columnGap: 8,
    backgroundColor: "black",
    color: "#FFF",
    borderWidth: 2,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 2,
    // width: 100,
  },
  sectionBtns_btnText: {
    color: "#FFF",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 14,
  },
});

export default AnimalFilters;
