import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { Picker } from "@react-native-picker/picker";


interface CityAndSectorSelectProps {
  cities: { id: string; name: string }[];
  sectors: { id: string; name: string }[];
  selectedCityId: string;
  selectedSectorId: string;
  onCityChange: (cityId: string, cityName: string) => void;
  onSectorChange: (sectorId: string, sectorName: string) => void;
}

const CityAndSectorSelect: FC<CityAndSectorSelectProps> = ({ 
  cities, sectors, selectedCityId, selectedSectorId, onCityChange, onSectorChange 
}) => {
  const handleCityChange = (itemValue: string, itemIndex: number) => {
      const cityId = itemValue;
      const cityName = cities.find(city => city.id === cityId)?.name;
      console.log('CITY ID : ',  cityId)
      console.log('CITY NAME : ', cityName)
      onCityChange(cityId, cityName);
  };


  const handleSectorChange = (itemValue: string, itemIndex: number) => {
    const sectorId = itemValue;
    const sectorName = sectors.find(sector => sector.id === sectorId)?.name;
    onSectorChange(sectorId, sectorName);
  };
  

  return (
    <View style={styles.selectCitySector}>
      <Text style={styles.text}>Sélectionner la ville : </Text>
      <Picker
        selectedValue={selectedCityId}
        onValueChange={handleCityChange}
      >
        <Picker.Item label="Choisir une ville" value="" />
        {cities.map((city) => (
          <Picker.Item key={city.id} label={city.name} value={city.id} />
        ))}
      </Picker>

      {sectors.length > 0 && selectedCityId && (
        <View>
          <Text>Sélectionner le secteur : </Text>
          <Picker
            selectedValue={selectedSectorId}
            onValueChange={handleSectorChange}
          >
            <Picker.Item label="Choisir un secteur" value="" />
            {sectors.map((sector) => (
              <Picker.Item key={sector?.id} label={sector?.name} value={sector?.id} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
};

const styles = {
  selectCitySector : {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 20,
    // marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 2
  },

}

export default CityAndSectorSelect;
