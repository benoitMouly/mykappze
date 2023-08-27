import React, { useState, useEffect } from "react";
import logocat from "../assets/kappze_logo_circle_noir_roigne.png";
import { useDispatch, useSelector } from "react-redux";
import { PaymentsScreen } from "./Payments.tsx";
import { View, Text, ScrollView } from "react-native";

const Invoices = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, uid } = useSelector((state) => state.auth);
  const stripeCustomerId = useSelector((state) => state.auth.stripeCustomerId);

  return (
    <View>
      <ScrollView style={styles.container}>
        <Text style={styles.titleText}>Vos derniers paiements</Text>

        <PaymentsScreen userCustomerId={stripeCustomerId} />
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "column",
    // rowGap: 20,
    backgroundColor: "#2f4f4f",
    padding: 5,
  },
  titleText: {
    color: "#fff",
    fontSize: 21,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    marginLeft: 20,
    marginBottom: 0,
    marginTop: 20,
  },
};

export default Invoices;
