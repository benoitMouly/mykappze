import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { addAssociation } from '../features/associations/associationSlice';

const AssociationForm = () => {
    const { uid } = useSelector((state) => state.auth);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigation();

    const handleSubmit = () => {
        const data = {
            adminId: uid,
            name: name,
            email: email,
            city: city,
            postalCode: postalCode,
            phoneNumber: phoneNumber,
            role: [{ uid: uid, isAdmin: true }]
        };
        dispatch(addAssociation({ userId: uid, associationData: data }))
            .then(() => {
                Alert.alert(
                    "Association créée avec succès !",
                    "L'association est désormais disponible dans votre listing.",
                    [{ text: "OK", onPress: () => navigate.navigate('Home') }],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                console.error('Error adding association: ', error);
                Alert.alert(
                    "L'association n'a pas pu être créée.",
                    `En cas de besoin, transmettez le message d'erreur suivant au support : ${error}`,
                    [{ text: "OK" }],
                    { cancelable: false }
                );
            });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Ajouter une nouvelle association</Text>
            <Text style={styles.paragraph}>
                Veillez à remplir le maximum de champ possible. Vous pourrez malgré tout modifier ces infos par la suite.
            </Text>
            <View style={styles.form}>
                <Text style={styles.label}>Nom:</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />
                <Text style={styles.label}>Email:</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} />
                <Text style={styles.label}>Ville:</Text>
                <TextInput style={styles.input} value={city} onChangeText={setCity} />
                <Text style={styles.label}>Code postal:</Text>
                <TextInput style={styles.input} value={postalCode} onChangeText={setPostalCode} />
                <Text style={styles.label}>Téléphone :</Text>
                <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />
                <Button title="Ajouter" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        color: 'white',
        marginBottom: 10,
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default AssociationForm;
