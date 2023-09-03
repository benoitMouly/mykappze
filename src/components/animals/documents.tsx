import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  addComment,
  deleteComment,
  updateComment,
} from "../../features/animals/commentsSlice";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import TextInputModal from "../../components/general/TextUpdateModal";
import Icon from "react-native-vector-icons/Ionicons";
import { createAndSendNotification } from "../../features/notifications/notificationSlice";
import EditableDocumentList from "../general/EditableDocuments";
import CustomDocumentList from "./customDocumentList";
// import { Modal, Button, View, StyleSheet } from 'react-native';

const CommentForm = ({ documents, animalId, animalName }) => {
  const { surname, uid } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const handleInputChange = (value) => {
    setComment(value);
  };

  const handleFormSubmit = () => {
    if (comment.trim()) {
      dispatch(
        addComment({
          animalId,
          comment: { texte: comment, auteur: surname },
          uid,
        })
      );
      setComment("");
    }

    const message = "Un document a été ajouté pour l'animal :  " + animalName;
    const userIds = [
      "oo1qP9CNSYNvgzingDITVJ4XL3a2",
      "zcsYehEmnLStL5twOUlP4Ee7FyK2",
      "4jEvW3mzCqO6GtLt4vHfYZxCHDI3",
    ];
    dispatch(createAndSendNotification({ userIds, message }));
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TextInput
        placeholder="Ajouter un commentaire"
        value={comment}
        onChangeText={handleInputChange}
        multiline
        numberOfLines={4}
        style={{ borderRadius: 4, flex: 1 }}
      />
      <TouchableOpacity onPress={handleFormSubmit}>
        <Icon
          style={styles.buttonIconElt}
          name="paper-plane"
          size={35}
          color="#2f4f4f"
        />
      </TouchableOpacity>
    </View>
  );
};

const DocumentSection = ({ animal, animalId, documentsLength, animalName, userIsAdmin }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [isDocModified, setIsDocModified] = useState(false);
  const dispatch = useDispatch();

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleModalToggle}
        style={styles.sectionBtns_btn}
      >
        {/* <Text style={{ color: "white" }}>COMMENTAIRES ({commentsLength})</Text> */}
        <Icon name="document-attach-outline" size={24} color="#fff" />
        <Text style={styles.commentsLength}> {documentsLength}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleModalToggle}
      >
        <View style={styles.modalContainer}>
          {/* <Button title="Fermer" onPress={handleModalToggle} /> */}
          <TouchableOpacity
            style={styles.closeModalComment}
            onPress={handleModalToggle}
          >
            <Icon
              style={styles.buttonIconElt}
              name="close"
              size={28}
              color="#2f2f2f"
            />
          </TouchableOpacity>

          <CustomDocumentList
            animal={animal}
            dispatch={dispatch}
            userIsAdmin={userIsAdmin}
          />
      
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    paddingTop: 20,
  },
  btnComments: {
    backgroundColor: "#2f2f2f",
  },
  // footer: {
  //   position: "absolute",
  //   width: "100%",
  //   height: "100%",
    // bottom: 0,
    // left: 0,
    // right: 0,
  //   backgroundColor: "#f8f8f8",
  //   borderTopColor: "#e8e8e8",
  //   borderTopWidth: 1,
  //   padding: 10,
  // },
  closeModalComment: {
    // backgroundColor: '#2f2f2f',
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
  },
  closeModalCommentText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 15,
  },
  text: {
    color: "#fff",
    fontFamily: "WixMadeforDisplay-Regular",
    fontSize: 14,
  },
  textInfo: {
    color: "#fff",
    fontFamily: "WixMadeforDisplay-Regular",
    fontSize: 11,
  },
  sectionBtns_btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 12,
  },
  commentsLength: {
    color: "#fff",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 18,
    marginBottom: 5,
  },
});

export default DocumentSection;
