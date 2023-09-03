import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MotherSelect = ({ animals, selectedAnimalId, currentAnimal, onAnimalChange, needsLabel }) => {
    // const handleAnimalChange = (itemValue, itemIndex) => {
    //     onAnimalChange(animals[itemIndex].id, animals[itemIndex].name);
    // };

    const handleAnimalChange = (itemValue: string, itemIndex: number) => {
        const animalId = itemValue;
        const animalName = animals.find(
          (animal) => animal.id === animalId
        )?.name;
        onAnimalChange(animalId, animalName);
      };

    // console.log('ANIMALS SELECT : ', animals);

    return (
        <View style={styles.container}>
            {needsLabel && (<Text style={styles.label}>Sélectionner une mère</Text>)}
            
            <Picker
                selectedValue={selectedAnimalId}
                onValueChange={handleAnimalChange}
                style={styles.picker}
                prompt="Choisir un animal"
            >
                <Picker.Item label="Choisir une mère" value="" />
                {animals.map((animal, index) => (
                    <Picker.Item key={index} label={animal.name ? animal.name : animal.id} value={animal.id} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: 250,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    picker: {
        // Vous pouvez ajouter d'autres styles si nécessaire
    },
});

export default MotherSelect;
