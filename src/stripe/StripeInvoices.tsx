import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateBillingInfo } from '../features/payments/billingSlice'; // Remplacez par le chemin vers votre slice Redux

const UpdateBillingInfo = () => {
    const dispatch = useDispatch();

    // Récupérez les informations de facturation actuelles depuis Redux
    const currentBillingInfo = useSelector(state => state.billing.billingInfo); // Remplacez "yourSliceName" par le nom de votre slice

    // Utilisez l'état local pour gérer les modifications temporaires
    const [billingInfo, setBillingInfo] = useState(currentBillingInfo);

    useEffect(() => {
        setBillingInfo(currentBillingInfo);
    }, [currentBillingInfo]);

    const handleUpdate = () => {
        // Dispatch l'action pour mettre à jour les informations de facturation
        dispatch(updateBillingInfo(billingInfo));
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nom complet"
                value={billingInfo.name}
                onChangeText={(text) => setBillingInfo(prev => ({ ...prev, name: text }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={billingInfo.email}
                onChangeText={(text) => setBillingInfo(prev => ({ ...prev, email: text }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Adresse"
                value={billingInfo.address.line1}
                onChangeText={(text) => setBillingInfo(prev => ({ ...prev, address: { ...prev.address, line1: text } }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Ville"
                value={billingInfo.address.city}
                onChangeText={(text) => setBillingInfo(prev => ({ ...prev, address: { ...prev.address, city: text } }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Code postal"
                value={billingInfo.address.postal_code}
                onChangeText={(text) => setBillingInfo(prev => ({ ...prev, address: { ...prev.address, postal_code: text } }))}
            />
            <Button title="Mettre à jour" onPress={handleUpdate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
});

export default UpdateBillingInfo;
