import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const billingSlice = createSlice({
    name: 'billing',
    initialState: {
        billingInfo: {
            name: '',
            email: '',
            address: {
                line1: '',
                city: '',
                postal_code: '',
            },
        },
    },
    reducers: {
        updateBillingInfo: (state, action) => {
            state.billingInfo = action.payload;
        },
    },
});


export const fetchPaymentsForCustomer = async (customerId) => {
    console.log('customer id !!', customerId)
    try {
        const response = await axios.get('https://us-central1-kappze.cloudfunctions.net/stripeapi/stripe/getPaymentsForCustomer', {
            params: {
                customerId: customerId.userCustomerId
            }
        });
        const payments = response.data;
        // Affichez les paiements comme vous le souhaitez
        console.log('PAYMENTS : ', payments)
        return payments;
    } catch (error) {
        console.error('Failed to fetch payments:', error.message);
        throw error; // Vous pouvez propager l'erreur pour la gérer à l'endroit où vous appelez cette fonctionc
    
    }
};


export const { updateBillingInfo } = billingSlice.actions;

export default billingSlice.reducer;
