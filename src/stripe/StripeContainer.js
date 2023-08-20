import React from "react";
import { StripeProvider } from '@stripe/stripe-react-native';
import { CheckoutForm } from './CheckoutForm';

const Stripe = () => {
    return (
        <StripeProvider publishableKey="pk_test_51Ng7WZKu63J8L2mL7dvfBNlwLZuhwHBiNdjM50Il4BLNklaaw7fq1gKFOERzW4SRbHPJJQpW9cis4RDY9TQH5OUW00BEIm8fzk">
            <CheckoutForm />
        </StripeProvider>
    )
}

export default Stripe;
