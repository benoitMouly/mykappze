import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, resetStatus, checkEmailExists } from '../features/user/userSlice';
import { useNavigation } from '@react-navigation/native';
import { getErrorMsg } from '../utils/errorMessages';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const dispatch = useDispatch();
    const { status, error: errorCode } = useSelector((state) => state.auth);
    const [errorMessage, setError] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        if (errorCode) {
            setError(getErrorMsg(errorCode));
        } else {
            setError(null);
        }
        return () => {
            setError(null); // reset error when the component unmounts
        };
    }, [errorCode, setError]);

    const handleSubmit = () => {
        dispatch(checkEmailExists(email))
            .then(() => {
                dispatch(resetPassword(email));
                setIsEmailSent(true);
            })
            .catch((errorCode) => {
                console.log(errorCode);
            });
    };

    const handleResetStatus = () => {
        dispatch(resetStatus());
        setIsEmailSent(false);
        setEmail('');
    };

    return (
        <View style={styles.container}>
            {!isEmailSent ? (
                <>
                    <Text style={styles.title}>Mot de passe oublié ?</Text>
                    <View style={styles.form}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
                        <Button title="Envoyer l'email de réinitialisation" onPress={handleSubmit} />
                    </View>
                </>
            ) : (
                <>
                    {status === 'fulfilled' ? (
                        <>
                            <Text style={styles.title}>Email envoyé</Text>
                            <Text style={styles.message}>Un email de réinitialisation a été envoyé à l'adresse suivante : {email}</Text>
                        </>
                    ) : status === 'loading' ? (
                        <Text style={styles.title}>Envoi en cours .. </Text>
                    )
                        : (
                            <>
                                <Text style={styles.title}>Erreur lors de l'envoi de l'email</Text>
                                <Text style={styles.error}>{errorMessage}</Text>
                                <Button title="Réessayer" onPress={handleResetStatus} />
                            </>
                        )}
                </>
            )}
            <Text style={styles.redirect} onPress={() => navigation.navigate('Login')}>
                Retour à la page de connexion
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 18,
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: 'black',
        backgroundColor: 'white',
        padding: 20,
        textAlign: 'center',
    },
    error: {
        fontSize: 16,
        color: 'red',
    },
    redirect: {
        fontSize: 16,
        color: 'white',
        textDecorationLine: 'underline',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ForgotPasswordForm;
