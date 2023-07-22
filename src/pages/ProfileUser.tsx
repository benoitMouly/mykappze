// ProfileUser.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssociations } from '../features/associations/associationSlice';
import AssociationCard from '../components/association/associationCard'
import { RootState, useAppDispatch } from "../store/store";

import LoadingPage from '../components/general/loadingPage'; // Importez votre composant de chargement ici

const ProfileUser = () => {
    const { uid, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { data: associations, status, error } = useSelector((state: RootState) => state.associations);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isAuthenticated && uid) {
            dispatch(fetchAssociations(uid));
        }

        console.log(associations)
    }, [dispatch, uid, isAuthenticated]);

    return (
        <ScrollView style={styles.container}>
            {associations.length ? 
                <>
                    <Text style={styles.title}>Voici la liste de vos associations :</Text>
                    <View style={styles.listAssociation}>
                        {associations.map((association) => (
                            <AssociationCard key={association.id} association={association} />
                        ))}
                    </View>
                </> : (
                    <View style={styles.authPage}>
                        <Text>Vous n'avez pas encore d'associations. </Text>
                    </View>
                )
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#2F4F4F'
    },
    title: {
        fontSize: 20,
        color: '#fff',
        padding: 10,
        marginTop: 0,
        fontFamily: "WixMadeforDisplay-Bold",
    },
    listAssociation: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 10,
        columnGap: 0,
        paddingTop: 30,
        paddingHorizontal: 5
    },
    authPage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileUser;
