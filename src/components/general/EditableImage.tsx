import React, { useState } from 'react';
import { Button, Image, TouchableOpacity, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
// import Icon from "react-native-vector-icons/Ionicons";
import { Icon, Avatar, Badge } from '@rneui/base';
import { uploadImage } from '../../features/canals/canalSlice';

const EditableImage = ({imageUri, setImageUri, isModified}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  // const [imageUri, setImageUri] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // const handleSave = (uri) => {
  //   console.log(uri)
  //   setImageUri(uri);
  //   setModalVisible(false);
  //   isModified(true);

  // };
  

  const handleSave = async (uri) => {
    console.log(uri);
    const imageName = `image_${Date.now()}.jpg`; // Génère un nom unique pour l'image
    const imageUrl = await uploadImage(uri, imageName); // Télécharge l'image et récupère l'URL
    setImageUri(imageUrl); // Met à jour l'URI de l'image avec l'URL de l'image téléchargée
    setModalVisible(false);
    isModified(true);
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
      {/* <TouchableOpacity onPress={openImagePickerAsync} style={styles.buttonsPicker}>
        <Text style={styles.buttonText}>
          {imageUri ? 'Modifier' : 'Choisir'}
        </Text>
      </TouchableOpacity> */}

      {imageUri ? 
        <Avatar
          rounded
          size={100}
          source={{uri: imageUri}}
          containerStyle={{ backgroundColor: 'transparent' }}
          // containerStyle={{width: 200, height: 200}}
        >
          <Avatar.Accessory 
            size={20} 
            reverse
            onPress={openImagePickerAsync}
            name='pencil'
            type='ionicon' 
            containerStyle={{ backgroundColor: 'transparent'}}
            color = '#2F4F4F'
            
          />
        </Avatar>
        :
        <Avatar
          rounded
          size={100}
          icon={{name: 'add', color: '#fff', type: 'material'}}
          containerStyle={{ backgroundColor: '#000' }}
          // containerStyle={{width: 200, height: 200}}
        >
          <Avatar.Accessory 
            size={20} 
            reverse
            onPress={openImagePickerAsync}
            name='pencil'
            type='ionicon' 
            containerStyle={{ backgroundColor: 'transparent'}}
            color = '#2F4F4F'
            
          />
        </Avatar>
      }
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