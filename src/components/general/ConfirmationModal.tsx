import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

const ConfirmationModal = ({ visible, onClose, onConfirm, messageType }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <View style={styles.centeredBlock}>
        {/* <Text style={styles.modalText}>Voulez-vous vraiment supprimer cet animal ?</Text> */}

        <View style={styles.backGroundLogo}>
          <Image
            source={require("../../assets/transparent-without-circle.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.modalView}>
        <Text style={styles.modalText}>{messageType}</Text>
        <Text style={styles.modalSubText}>Cette action est définitive</Text>
        <View style={styles.btnChoice}>
          <TouchableOpacity onPress={onConfirm} style={styles.buttonsPicker}>
            <Text style={styles.buttonTextNo}>OUI</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.buttonsPicker}>
            <Text style={styles.buttonTextYes}>NON</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // demi-transparent
    rowGap: 0,
    // margin: 10
  },
  centeredBlock: {
    margin: 4,
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
  backGroundLogo: {
    margin: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100
  },
});

export default ConfirmationModal;
