import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";

const SelectModal = ({ visible, onClose, onConfirm, options }) => {
  const [value, setValue] = useState(options[0]?.value || "");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Veuillez choisir une option</Text>
          
          <Picker
            selectedValue={value}
            onValueChange={(itemValue, itemIndex) => setValue(itemValue)}
            style={{ height: 50, width: 150 }}
          >
            {options.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
          
          <TouchableOpacity
            onPress={() => onConfirm(value)}
            style={styles.buttonsPicker}
          >
            <Text style={styles.buttonTextYes}>OUI</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Remplacer par vos propres styles
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
      modalInfo: {
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
        backgroundColor: "transparent",
        padding: 15,
        borderRadius: 3,
      },
      buttonText: {
        padding: 2,
        color: "white",
        fontFamily: "WixMadeforDisplay-Bold",
        fontSize: 15
      },
      buttonTextYes: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: "white",
        fontFamily: "WixMadeforDisplay-Bold",
        fontSize: 15,
        backgroundColor: 'red'
      },
      buttonTextNo: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: "white",
        fontFamily: "WixMadeforDisplay-Bold",
        fontSize: 15,
        backgroundColor: 'green'
      },
      btnChoice: {
        flexDirection: 'row',
        columnGap: 30
      },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10
    }
});

export default SelectModal;
