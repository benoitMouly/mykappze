import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';

const EditableTextField = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState('foo');
  const [tempTextFieldValue, setTempTextFieldValue] = useState(textFieldValue);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSave = () => {
    setTextFieldValue(tempTextFieldValue);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempTextFieldValue(textFieldValue);
    setModalVisible(false);
  };

  return (
    <View style={{paddingTop: 60}}>
      <TextInput value={textFieldValue} editable={false} />
      <Button title="Edit" onPress={toggleModal} />

      <Modal isVisible={isModalVisible}>
        <View style={{backgroundColor: "white", padding: 20}}>
          <TextInput
            value={tempTextFieldValue}
            onChangeText={setTempTextFieldValue}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={handleCancel} />
        </View>
      </Modal>
    </View>
  );
};

export default EditableTextField;