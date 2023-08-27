import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import TextInputModal from "../components/general/TextUpdateModal";
import ConfirmationModal from "../components/general/ConfirmationModal";
import { CheckoutForm } from "../stripe/CheckoutForm";

const SubscribePage: React.FC = () => {
  const { name, surname, uid, licenseNumber } = useSelector(
    (state: RootState) => state.auth
  );

  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isEditNameVisible, setEditVisible] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [settedCanalId, setCanalId] = useState("");

  const dispatch = useDispatch();

  // console.log("LICENSE NUMBER : ", licenseNumber);

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title1}>Achat d'une licence</Text> */}
      <CheckoutForm />
    </ScrollView>
  );
};

export default SubscribePage;

const styles = {
  container: {
    height: "100%",
    backgroundColor: "#2F4F4F",
    padding: "200px",
    flexDirection: "column",
  },
};
