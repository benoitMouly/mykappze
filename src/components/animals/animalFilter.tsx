import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AnimalList from "./animalList";
import { getFilteredAnimals } from "./getFilteredAnimal";
import { useSelector } from "react-redux";
import { COLORS } from "../../data/colors";

interface FilterValues {
  text: string;
  selectCity: string;
  selectSector: string;
}

// interface FilteredSectors {
//   id: string;
//   city: string;
//   cityId: string;
//   associationid: string;
//   name: string;
//   userId: string;
// }

interface Animal {
  id: string;
  name: string;
  image?: string;
  sex: string;
  isMother: boolean;
  cityName: string;
  sectorName: string;
}

interface Sector {
  id: string;
  city: string;
  cityId: string;
  associationid: string;
  name: string;
  userId: string;
}

interface City {
  id: string;
  associationid: string;
  name: string;
  userId: string;
}

interface AnimalFiltersProps {
  animals: Animal[];
  sectorized: Sector[];
}

interface DataState<T> {
  data: T[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  // Ajoutez ici d'autres champs si nécessaire
}

// Utilisez cette interface dans l'interface RootState
interface RootState {
  cities: DataState<City>;
  animals: DataState<Animal>;
  sectors: DataState<Sector>;
  auth: {
    isAuthenticated: boolean;
    uid: string;
  };
}



const AnimalFilters: React.FC<AnimalFiltersProps> = ({
  animals,
  sectorized,
}) => {
  const { data: cities, status: citiesStatus } = useSelector(
    (state: RootState) => state.cities
  );

  const { data: sectors, status: sectorsStatus } = useSelector(
    (state: RootState) => state.sectors
  );

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState('');
  const [filterByDisease, setFilterByDisease] = useState(null);
  const [filterBySterilization, setFilterBySterilization] = useState(null);
  const [filterByIdentification, setFilterByIdentification] = useState(null);
  const [filterByOwner, setFilterByOwner] = useState(null);
  const [filterBySex, setFilterBySex] = useState('');
  const [filterByName, setFilterByName] = useState('');
  const [filterByMom, setFilterByMom] = useState(null);
  const [filters, setFilters] = useState<FilterValues>({
    text: "",
    selectCity: "option1",
    selectSector: "option1",
  });

    const [filteredSectors, setFilteredSectors] = useState([]);
    useEffect(() => {

      if (selectedCityId) {

          const relevantSectors = sectorized.filter(sector => sector.cityId === selectedCityId);
          console.log(relevantSectors)
          setFilteredSectors(relevantSectors)

      }

  }, [selectedCityId]);



  const handleNameChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };


  const cityOptions = [
    { id: '', label: 'Toutes' },
    ...cities.map(city => ({ id: city.id, label: city.name }))
  ];

  const handleCityChange = (value: string) => {    
    const selectedCity = cityOptions.find(city => city.id === value);
    if (selectedCity) {
      setSelectedCityId(selectedCity.id);
      setSelectedCity(selectedCity.label);
    } else {
      setSelectedCityId(null); // Réinitialisez la valeur sélectionnée
      setSelectedCity(''); // Réinitialisez le label sélectionné
    }

    setSelectedSector('')
  };

  const sectorOptions = [
    { id: '', label: 'Tous' },
    ...filteredSectors.map(sector => ({ id: sector.id, label: sector.name }))
  ];

  const handleSectorChange = (value: string) => {    
    const selectedSector = sectorOptions.find(sector => sector.id === value);
    if (selectedSector) {
      setSelectedSectorId(selectedSector.id);
      setSelectedSector(selectedSector.label);
    } 
    else {
      setSelectedSectorId(null); // Réinitialisez la valeur sélectionnée
      setSelectedSector(''); // Réinitialisez le label sélectionné
    }
  };

  const handleColorChange = (value: string) => {
    setSelectedColor(value);
  }
  

  const handleDiseaseChange = (value: boolean) => {
    setFilterByDisease(value);
};

const handleSexChange = (value: string) => {
    setFilterBySex(value)
};

const handleMomChange = (value: boolean) => {
    setFilterByMom(value);
}

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
    selectedCity,
    selectedSector,
    selectedColor,
    filterByDisease,
    filterBySterilization,
    filterByIdentification,
    filterByOwner,
    filterBySex,
    filterByMom,
    filters.text // Utiliser la valeur du champ de texte pour filtrer par le nom.
  );

  return (
    <View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Nom : </Text>
        <TextInput
          style={styles.filterInput}
          value={filters.text}
          onChangeText={(value) => handleNameChange("text", value)}
        />
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Ville :</Text>
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={selectedCityId}
          onValueChange={handleCityChange}
        >
          {cityOptions.map((city) => (
            <Picker.Item key={city.id} label={city.label} value={city.id} />
          ))}
        </Picker>
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Secteurs :</Text>
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={selectedSectorId}
          onValueChange={handleSectorChange}
        >
          {sectorOptions.map((sector) => (
            <Picker.Item key={sector.id} label={sector.label} value={sector.id} />
          ))}
        </Picker>
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Colors :</Text>
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={selectedColor}
          onValueChange={handleColorChange}
        >
          <Picker.Item label='Toutes' value={''} />
          {COLORS.map((color) => (
            <Picker.Item key={color} label={color} value={color} />
          ))}
        </Picker>
      </View>






      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sexe :</Text>
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={filterBySex}
          onValueChange={handleSexChange}
        >
          <Picker.Item label='Toutes' value={''} />
          <Picker.Item label= "Mâle" value={"Mâle"} />
          <Picker.Item label= "Femelle" value={"Femelle"} />
          <Picker.Item label= "Inconnu" value={"Inconnu"} />

        </Picker>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Stérilisés :</Text>
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={filterBySterilization}
          onValueChange={handleSterilizationChange}
        >
          <Picker.Item label='-' value={null} />
          <Picker.Item label= "Oui" value={true} />
          <Picker.Item label= "Non" value={false} />
        </Picker>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Maladies :</Text>
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={filterByDisease}
          onValueChange={handleDiseaseChange}
        >
          <Picker.Item label='-' value={null} />
          <Picker.Item label= "Oui" value={true} />
          <Picker.Item label= "Non" value={""} />
        </Picker>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Identifié :</Text>
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={filterByIdentification}
          onValueChange={handleIdentificationChange}
        >
          <Picker.Item label='-' value={null} />
          <Picker.Item label= "Oui" value={true} />
          <Picker.Item label= "Non" value={""} />
        </Picker>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Appartient à un propriétaire :</Text>
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={filterByOwner}
          onValueChange={handleOwnerChange}
        >
          <Picker.Item label='-' value={null} />
          <Picker.Item label= "Oui" value={true} />
          <Picker.Item label= "Non" value={""} />
        </Picker>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Est une mère :</Text>
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={filterByMom}
          onValueChange={handleMomChange}
        >
          <Picker.Item label='-' value={null} />
          <Picker.Item label= "Oui" value={true} />
          <Picker.Item label= "Non" value={""} />
        </Picker>
      </View>


      <AnimalList animals={filteredAnimals} />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
});

export default AnimalFilters;
