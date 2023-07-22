import React from "react";
import { Modal, View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";

// const CustomAlert = ({ visible, onClose }) => (
//   <Modal
//     animationType="slide"
//     transparent={true}
//     visible={visible}
//     onRequestClose={onClose}
//   >
//     <View style={styles.centeredView}>
//       <View style={styles.modalView}>
//         <Text style={styles.modalText}>Animal ajouté avec succès</Text>
//         <Image source={require('../../assets/transparent-without-circle.png')} style={styles.logo} /> 


//         {/* <Button title="Fermer" onPress={onClose} /> */}
//         <TouchableOpacity
//               onPress={onClose}
//               style={styles.buttonsPicker}
//             >
//               <Text style={styles.buttonText}>
//                 Fermer
//               </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </Modal>
// );

const CustomAlert = ({ visible, onClose, message }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{message}</Text>
        <Image source={require('../../assets/transparent-without-circle.png')} style={styles.logo} /> 
        <TouchableOpacity
              onPress={onClose}
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonText}>
                Fermer
              </Text>
        </TouchableOpacity>
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
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 3,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 20
  },
  logo: {
    width: 200,
    height: 200,
    marginRight: 10,
  },
  buttonsPicker: {
    backgroundColor: "#2F2F2F",
    padding: 5,
    borderRadius: 3,
  },
  buttonText: {
    padding: 2,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 15
  },
});

export default CustomAlert;
