import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';  // Utilisez n'importe quel paquet de composants de votre choix pour les checkbox
import { COLORS } from '../../data/colors';

interface ColorSelectProps {
    selectedColors: string[];
    onChange: (color: string) => void;
}

const ColorSelect: FC<ColorSelectProps> = ({ selectedColors, onChange }) => {
    const handleColorChange = (color: string) => {
        if (onChange) {
            onChange(color);
            console.log(color)
        }
    };

    return (
        <View style={styles.container}>
            {COLORS.map((color, index) => (
                <View key={index} style={styles.item}>
                    <Checkbox
                        status={selectedColors && selectedColors.includes(color) ? 'checked' : 'unchecked'}
                        onPress={() => handleColorChange(color)}
                    />
                    <Text style={styles.label}>{color.charAt(0).toUpperCase() + color.slice(1)}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 16
        // alignItems: 'center'
    },
    item: {
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: 'black',
    },
});

export default ColorSelect;
