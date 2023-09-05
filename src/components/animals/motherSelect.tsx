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
            {needsLabel && (<Text style={styles.label}>Sélectionner la mère</Text>)}
            
            <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedAnimalId}
                onValueChange={handleAnimalChange}
                style={styles.picker}
                prompt="Choisir une mère"
            >
                {/* <Picker.Item label="Choisir une mère" value="" style={styles.pickerItems}/> */}
                {animals.map((animal, index) => (
                    <Picker.Item key={index} label={animal.name ? animal.name : animal.id} value={animal.id} style={styles.pickerItems} />
                ))}
            </Picker>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: 250,
        marginBottom: 30,
        marginTop: 10
        // backgroundColor: '#fff',
        // padding: 20
    },
    label: {
        marginBottom: 15,
        color: "#fff",
        fontSize: 15,
        fontFamily: "WixMadeforDisplay-Bold",
        fontWeight: "600",
    },
    pickerContainer: {
        padding: 0,
        backgroundColor: '#fff',
        borderRadius: 2
    },
    picker: {
        color: '#000',
        fontFamily: "WixMadeforDisplay-Regular",
        padding: 0
    },
    pickerItems: {
        color: '#000',
        fontFamily: "WixMadeforDisplay-Regular",
        // padding: 150
        
    }
});

export default MotherSelect;
