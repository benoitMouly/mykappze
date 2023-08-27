import React, { useEffect, useState } from "react";
import { fetchPaymentsForCustomer } from "../features/payments/billingSlice";
import { View, Text } from "react-native";
import { PaymentsList } from '../components/payments/paymentsList';

export const PaymentsScreen = ( userCustomerId ) => {
    const [payments, setPayments] = useState([]);

    console.log('USSSSERRRRR : ', userCustomerId)

    useEffect(() => {
        const fetchPayments = async () => {
            const customerId = userCustomerId; // Remplacez par l'ID du client
            const fetchedPayments = await fetchPaymentsForCustomer(customerId);
            console.log('customerId : ', customerId)
            console.log('fetchedPayments : ', fetchPayments)
            setPayments(fetchedPayments);
        };

        fetchPayments();
    }, []);

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#2f4f4f'}}>
            <PaymentsList payments={payments} />
        </View>
    );
};
