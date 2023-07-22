import React, { useState } from 'react';
import { Button, Image, TouchableOpacity, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';

const EditableImage = ({imageUri, setImageUri}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  // const [imageUri, setImageUri] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSave = uri => {
    setImageUri(uri);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.canceled === true) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets[0].uri) {
      handleSave(pickerResult.assets[0].uri);
    }
  };

  return (
    <View style={{paddingTop: 5}}>
      
      {/* <Button title="Edit Image" onPress={toggleModal} /> */}

      <TouchableOpacity onPress={openImagePickerAsync} style={styles.buttonsPicker}>
              <Text style={styles.buttonText}>
                {imageUri ? 'Modifier' : 'Choisir'}
              </Text>
        </TouchableOpacity>

        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
        
      {/* <Modal isVisible={isModalVisible}>
        <View style={{backgroundColor: "white", padding: 20}}>
          <Button title="Choisir une image" onPress={openImagePickerAsync} />
          <Button title="Annuler" onPress={handleCancel} />
        </View>
      </Modal> */}
    </View>
  );
};

const styles = {
  buttonsPicker:{
    backgroundColor: '#2F2F2F',
    padding: 5,
    borderRadius: 3,
    marginBottom: 20,
    width: 100,
    alignItems: 'center'
  },
  buttonText: {
    padding: 2,
    marginBottom: 4,
    color: 'white',
    fontFamily: "WixMadeforDisplay-Bold",
  },
}

export default EditableImage;