import React, { FC } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface CitySectorAndSectorSelectProps {
  citiesSector: { id: string; name: string }[];
  selectedCitySectorId: string;
  onCitySectorChange: (citySectorId: string, citySectorName: string) => void;
}

const CitySectorAndSectorSelect: FC<CitySectorAndSectorSelectProps> = ({
  citiesSector,
  selectedCitySectorId,
  onCitySectorChange,
}) => {
  const handleCitySectorChange = (itemValue: string, itemIndex: number) => {
    const citySectorId = itemValue;
    const citySectorName = citiesSector.find(
      (citySector) => citySector.id === citySectorId
    )?.name;
    console.log("CITY ID : ", citySectorId);
    console.log("CITY NAME : ", citySectorName);
    onCitySectorChange(citySectorId, citySectorName);
  };

  console.log('citiiiees sector : ', citiesSector)

  return (
    <View style={styles.selectCitySectorSector}>
      <Text style={styles.text}>Sélectionner la ville : </Text>
      <Picker
        selectedValue={selectedCitySectorId}
        onValueChange={handleCitySectorChange}
      >
        <Picker.Item label="Choisir une ville" value="" />
        {citiesSector.map((citySector) => (
          <Picker.Item
            key={citySector.id}
            label={citySector.name}
            value={citySector.id}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = {
  selectCitySectorSector: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 20,
    // marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 2,
  },
};

export default CitySectorAndSectorSelect;
