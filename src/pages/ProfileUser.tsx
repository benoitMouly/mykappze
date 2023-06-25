// ProfileUser.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssociations } from '../features/associations/associationSlice';
import AssociationCard from '../components/association/associationCard'
import { RootState, useAppDispatch } from "../store/store";

import LoadingPage from '../components/general/loadingPage'; // Importez votre composant de chargement ici



// import BackButton from '../components/general/BackButton' 

const ProfileUser = () => {
    const { uid, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { data: associations, status, error } = useSelector((state: RootState) => state.associations);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isAuthenticated && uid) {
            dispatch(fetchAssociations(uid));
        }
    }, [dispatch, uid, isAuthenticated]);

    // if (status === 'loading') {
    //     return <LoadingPage />
    // } else if (status === 'failed') {
    //     return (
    //         <View style={styles.errorContainer}>
    //             <Text>Error: {error}</Text>
    //         </View>
    //     )
    // } else {
        return (
            <View style={styles.container}>
                {/* <BackButton /> */}
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
                            {/* <BackButton /> */}
                        </View>
                    )
                }
            </View>
        );
    // }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 20,
        color: '#fff',
        padding: 10,
        marginTop: 0,
    },
    listAssociation: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
