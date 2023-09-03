import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { Checkbox } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { addLicense } from "../features/licences/licenceSlice";
import axios from 'axios';
import { TouchableOpacity } from "react-native-gesture-handler";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import CustomAlert from "../components/general/CustomAlert";
import Icon from "react-native-vector-icons/Ionicons";




export const CheckoutForm = () => {
    const stripe = useStripe();
    const dispatch = useDispatch();
    const [licenseError, setLicenseError] = useState(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [cgvError, setCgvError] = useState(null);
    const [oldBillingDetails, setOldBillingDetails] = useState(null);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();


    const [billingDetails, setBillingDetails] = useState({
        name: '',
        email: '',
        address: {
            line1: '',
            citySector: '',
            postal_code: '',
            country: ''
        }
    });
    // Récupérez l'uid de l'utilisateur actuel à partir de Redux
    const uid = useSelector((state) => state.auth.uid);
    const currentLicense = useSelector((state) => state.auth.licenseNumber)




    useEffect(() => {
        const fetchBillingInfo = async () => {
            const db = getFirestore();
            const billingInfoRef = doc(db, "billingInfo", uid);
            const billingInfoDoc = await getDoc(billingInfoRef);

            if (billingInfoDoc.exists()) {
                setOldBillingDetails(billingInfoDoc.data());
                setBillingDetails(billingInfoDoc.data());
            }
        };

        fetchBillingInfo();
    }, [uid]);


    const handleSubmit = async () => {


        if (!acceptTerms) {
            setCgvError("Veuillez accepter les Conditions Générales de Vente avant de procéder au paiement.");
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            paymentMethodType: "Card"

        });
        if (!error) {
            console.log('Token Généré: ', paymentMethod);
            const { id } = paymentMethod;

            // Vérifiez si le client existe
            const getDifferences = () => {
                let differences = {};
                for (let key in billingDetails) {
                    if (typeof billingDetails[key] === 'object') {
                        for (let subKey in billingDetails[key]) {
                            if (oldBillingDetails[key][subKey] !== billingDetails[key][subKey]) {
                                differences[subKey] = billingDetails[key][subKey];
                            }
                        }
                    } else {
                        if (oldBillingDetails[key] !== billingDetails[key]) {
                            differences[key] = billingDetails[key];
                        }
                    }
                }
                return differences;
            };

            const keyMapping = {
                name: "Nom",
                email: "Email",
                "line1": "Adresse",
                "citySector": "Ville",
                "postal_code": "Code postal",
                "country": "Pays"
            };


            const formatDifferences = (differences, currentBilling) => {
                let formattedString = "";

                for (let key in differences) {
                    const friendlyKey = keyMapping[key] || key; // Utilisez la clé traduite si elle existe, sinon la clé originale

                    if (currentBilling[key] && differences[key]) {
                        formattedString += `${friendlyKey}: ${currentBilling[key]} -> ${differences[key]}\n`;
                    } else if (!currentBilling[key] && differences[key]) {
                        formattedString += `${friendlyKey} :  ${differences[key]}\n`;
                    }
                }

                return formattedString;
            };

            const differences = getDifferences();
            if (Object.keys(differences).length > 0) {
                const formattedDifferences = formatDifferences(differences, billingDetails);

                Alert.alert(
                    "Confirmation",
                    "Les informations de facturation suivantes seront mises à jour :\n\n" + formattedDifferences + "\n\nVoulez-vous continuer ?",
                    [
                        {
                            text: "Annuler",
                            onPress: () => console.log("Modification annulée"),
                            style: "cancel"
                        },
                        {
                            text: "Confirmer",
                            onPress: async () => {
                                await performPayment(id, billingDetails);
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                await performPayment(id, billingDetails);
            }
        };







    }


    const performPayment = async (id, billingDetails) => {
        let customerId;

        // Vérifiez si le client existe
        const findCustomerResponse = await axios.get("https://us-central1-kappze.cloudfunctions.net/stripeapi/stripe/find-customer", {
            params: {
                email: billingDetails.email,
                name: billingDetails.name
            }

        });

        if (findCustomerResponse.data.exists) {
            customerId = findCustomerResponse.data.customerId;
        } else {
            // Si le client n'existe pas, créez-en un nouveau
            const customerResponse = await axios.post("https://us-central1-kappze.cloudfunctions.net/stripeapi/stripe/create-customer", {
                name: billingDetails.name,
                email: billingDetails.email,
                address: {
                    line1: billingDetails.address.line1,
                    citySector: billingDetails.address.citySector,
                    postal_code: billingDetails.address.postal_code,
                    country: billingDetails.address.country
                },
            });

            if (customerResponse.data.success) {
                customerId = customerResponse.data.customerId;
                // Stockez le customerId dans Firebase
                const db = getFirestore();
                const userRef = doc(db, "users", uid);
                await setDoc(userRef, { stripeCustomerId: customerId }, { merge: true });
            } else {
                console.log("Erreur lors de la création du client");
                return;
            }
        }

        // Effectuer le paiement en utilisant l'ID du client
        setIsLoading(true); // Activer le loader
        const paymentResponse = await axios.post("https://us-central1-kappze.cloudfunctions.net/stripeapi/stripe/charge", {
            amount: 100,
            id: id,
            customerId: customerId, // Utilisez l'ID du client ici
            return_url: 'http://localhost:3000/login',
            receipt: billingDetails.email,
            billingDetails: billingDetails
        });

        

        if (paymentResponse.data.success) {
            setIsLoading(false); // Désactiver le loader après tout traitement
            console.log('Paiement réussi');
            const actionResult = await dispatch(addLicense({ userId: uid, licenseId: currentLicense }));
            if (addLicense.fulfilled.match(actionResult)) {
                console.log('Licence ajoutée avec succès');
                setIsAlertVisible(true);
                setTimeout(() => {
                    navigation.goBack();
                }, 2000);

            } else {
                setIsLoading(false); // Désactiver le loader après tout traitement
                setLicenseError(actionResult.payload);
            }
            const db = getFirestore();
            const billingInfoRef = doc(db, "billingInfo", uid);
            await setDoc(billingInfoRef, billingDetails);
        } else {
            console.log("Erreur lors du paiement");
        }
    };


    return (
        <ScrollView style={{ padding: 20 }}>
            {licenseError && <Text style={{ color: 'red' }}>{licenseError}</Text>}

            <Text style={styles.title1}>Acheter une licence</Text>
            <View style={styles.checkoutForm}>
                <Text style={styles.titleSection}>Facturation : </Text>
                <TextInput
                    placeholder="Nom complet"
                    value={billingDetails.name}
                    onChangeText={(text) => setBillingDetails(prev => ({ ...prev, name: text }))}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Email"
                    value={billingDetails.email}
                    onChangeText={(text) => setBillingDetails(prev => ({ ...prev, email: text }))}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Adresse"
                    value={billingDetails.address.line1}
                    onChangeText={(text) => setBillingDetails(prev => ({ ...prev, address: { ...prev.address, line1: text } }))}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Ville"
                    value={billingDetails.address.citySector}
                    onChangeText={(text) => setBillingDetails(prev => ({ ...prev, address: { ...prev.address, citySector: text } }))}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Code postal"
                    value={billingDetails.address.postal_code}
                    onChangeText={(text) => setBillingDetails(prev => ({ ...prev, address: { ...prev.address, postal_code: text } }))}
                    style={styles.textInput}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={styles.cgv}>J'accepte les Conditions Générales de Vente</Text>
                    <Checkbox
                        status={acceptTerms ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setAcceptTerms(!acceptTerms);
                            setCgvError(null); // Réinitialisez l'erreur lorsque l'utilisateur coche la case
                        }}
                        color={'#d15e41'}
                        uncheckedColor={"grey"}
                    />

                </View>
                {cgvError && <Text style={{ color: 'red', marginBottom: 20 }}>{cgvError}</Text>}


                <Text style={styles.titleSection}>Paiement par carte :</Text>

                <CardField
                    postalCodeEnabled={false}
                    onCardChange={(cardDetails) => {
                        console.log('cardDetails', cardDetails);
                    }}
                    style={{ height: 50, marginVertical: 30 }}
                />




                {/* <TouchableOpacity style={styles.btnPayment} title="Payer" onPress={handleSubmit}>
                    <Text style={styles.btnPayment_text}>Payer</Text>
                </TouchableOpacity> */}
                {!isLoading ? (<TouchableOpacity style={styles.btnPayment} title="Payer" onPress={handleSubmit}>
                    <Text style={styles.btnPayment_text}>Payer</Text>
                    <Icon name={"card-outline"} size={24} color="#fff" />
                </TouchableOpacity>) : (<TouchableOpacity style={styles.btnPaymentLoader} title="Payer" onPress={handleSubmit}>
                    <Text style={styles.btnPayment_text}>Paiement en cours .. </Text>
                </TouchableOpacity>)}
            </View>

            <CustomAlert
                visible={isAlertVisible}
                message={"Paiement effectué avec succès. Votre licence est activée."}
                onClose={() => setIsAlertVisible(false)}
            />

        </ScrollView>
    );
}





const styles = {
    container: {
        height: '100%',
        backgroundColor: "#2F4F4F",
        // marginBottom: 150
        flexDirection: 'column'
    },
    mainView: {
        backgroundColor: "#2F4F4F",
        // backgroundColor: "#075bb5",
        padding: 20,
        height: '100%',
        paddingBottom: 100
    },
    title1: {
        fontSize: 20,
        // fontWeight: "bold",
        color: "white",
        marginBottom: 5,
        fontFamily: "WixMadeforDisplay-Bold",
    },
    titleSection: {
        color: "#2f2f2f",
        fontSize: 15,
        fontFamily: "WixMadeforDisplay-Bold",
        fontWeight: "600",
    },
    cgv: {
        fontFamily: "WixMadeforDisplay-Regular",
        fontSize: 13
    },
    checkoutForm: {
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 20,
        flexDirection: 'column',
        rowGap: 10,
        borderRadius: 2,
 
        width: '100%'
    },
    textInput: {
        // backgroundColor: 'blue',
        padding: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontFamily: "WixMadeforDisplay-Regular",
    },
    btnPayment: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#d15e41',
        padding: 8,
        maxWidth: 150,
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center'
    },
    btnPaymentLoader: {
        backgroundColor: '#000',
        padding: 8,
    },

    btnPayment_text: {
        fontFamily: "WixMadeforDisplay-Bold",
        textAlign: 'center',
        fontSize: 18,
        color: '#fff'
    },

};








