import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity, Image
} from "react-native";

const TextInputModal = ({
  visible,
  onClose,
  onConfirm,
  onChangeText,
  messageType,
  subMessageType,
  placeholder
}) => {
  const [value, setValue] = useState("");
  const [isClose, setClose] = useState(false);

  const handleConfirm = () => {
    onConfirm(value); // Passez la valeur à la fonction parente onConfirm
    setValue(""); // Réinitialisez la valeur
  };

  const handleClose = () => {
    onClose(isClose)
    setClose(true)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.centeredBlock}>
        <View style={styles.backGroundLogo}>
      <Image source={require('../../assets/transparent-without-circle.png')} style={styles.logo} /> 
      </View>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{messageType}</Text>
          <Text style={styles.modalSubText}>{subMessageType}</Text>

          <TextInput
            style={styles.input}
            onChangeText={(text) => setValue(text)}
            value={value}
            placeholder={placeholder}
          />
          <View style={styles.btnChoice}>
            <TouchableOpacity
              onPress={handleClose} // Remplacer par handleConfirm
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonTextNo}>ANNULER</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm} // Remplacer par handleConfirm
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonTextYes}>VALIDER</Text>
            </TouchableOpacity>
          </View>
        </View>
        
</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // demi-transparent
    rowGap: 0,
  },
  centeredBlock: {
    margin: 4
  },
  modalView: {
    margin: 20,
    marginTop: -22,
    backgroundColor: "white",
    borderRadius: 3,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 5,
    width: '100%'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 20,
  },
  modalSubText:{
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "WixMadeforDisplay-Regular",
    fontSize: 15,
  },
  modalInfo: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 20,
  },
  logo: {
    width: 40,
    height: 40,
    // marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 60,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 5,

  },
  backGroundLogo: {
    margin: 20,
    // marginHorizontal: 30,
    // paddingHorizontal: 20,
    // marginTop: -40,
    backgroundColor: "white",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    // padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100
    // width: '100%',
  },
  buttonsPicker: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 25,
  },
  buttonText: {
    padding: 2,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 15,
  },
  buttonTextYes: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 15,
    backgroundColor: "rgb(47, 79, 79)",
    borderRadius: 2,
  },
  buttonTextNo: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 15,
    backgroundColor: "#FA5950",
  },
  btnChoice: {
    flexDirection: "row",
    columnGap: 10,
  },
  input: {
    height: 40,
    width: 260,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default TextInputModal;
