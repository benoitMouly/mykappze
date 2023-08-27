import { PaymentItem } from "./paymentItem";
import { ScrollView } from "react-native";

export const PaymentsList = ({ payments }) => {
    return (
        <ScrollView style={{backgroundColor: 'transparent'}}>
            {payments.map(payment => <PaymentItem key={payment.id} payment={payment} />)}
        </ScrollView>
    );
};
