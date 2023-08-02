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
// import { Modal, Button, View, StyleSheet } from 'react-native';

const CommentForm = ({ animalId }) => {
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
      <Button title="Commenter" onPress={handleFormSubmit} />
    </View>
  );
};

const CommentList = ({ animalId }) => {
  const { surname, uid } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments);
  const { data: users } = useSelector((state) => state.associationUsers);
  const [userIsAdmin, setUserRole] = useState({});
  const [isEditedCommentContentVisible, setEditVisible] = useState(false);
  const [editedAssociationName, setEditedCommentContent] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  // const [currentAssociationName, setCurrentAssociationName] = useState(
  //     association.name
  //   );

  const handleUpdateComment = (updatedText) => {
    dispatch(
      updateComment({ animalId, commentId: selectedCommentId, updatedText })
    );
  };

  useEffect(() => {
    users.forEach((user) => {
      if (user.id === uid) {
        setUserRole(user.isAdmin);
      }
    });
  }, [users]);

  useEffect(() => {
    dispatch(fetchComments(animalId));
  }, [dispatch, animalId]);

  const handleDelete = (commentId) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => dispatch(deleteComment({ animalId, commentId })),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <>
      <ScrollView style={{ margin: 0, padding: 0 }}>
        {comments.map((comment) => (
          <View
            key={comment.id}
            style={{ backgroundColor: "#2F2F2F", borderRadius: 3, padding: 15 }}
          >
            <View style={styles.editEltGroup}>
              <Text style={styles.text}>{comment?.texte}</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditVisible(true);
                  setSelectedCommentId(comment.id); // set the selected comment ID when the edit button is pressed
                  setEditedCommentContent(comment.texte); // set the current comment texte to the state
                }}
                style={styles.sectionHeader}
              >
                <View style={styles.buttonIcon}>
                  <Icon
                    style={styles.buttonIconElt}
                    name="pencil-outline"
                    size={15}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "#fff" }}>Par {comment.auteur}, </Text>
            <Text style={{ color: "#fff" }}>
              le {new Date(comment.horodatage).toLocaleString()}
            </Text>
            {(comment.authorId === uid || userIsAdmin) && (
              <Button
                title="Supprimer"
                onPress={() => handleDelete(comment.id)}
              />
            )}
          </View>
        ))}
      </ScrollView>
      <TextInputModal
        visible={isEditedCommentContentVisible}
        onClose={() => {
          setEditVisible(false);
          setSelectedCommentId(null); // reset the selected comment ID when the modal is closed
        }}
        onConfirm={(value) => {
          handleUpdateComment(value);
          setEditVisible(false);
          setSelectedCommentId(null); // reset the selected comment ID after update
        }}
        messageType={"Modifier le commentaire"}
        onChangeText={setEditedCommentContent}
        value={editedAssociationName} // set the initial value of the text input to the current comment texte
      />
    </>
  );
};

const CommentSection = ({ animalId, commentsLength }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleModalToggle}
        style={styles.sectionBtns_btn}
      ><Text style={{color: 'white'}}>COMMENTAIRES ({commentsLength})</Text></TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleModalToggle}
      >
        <View style={styles.modalContainer}>
          <Button title="Fermer" onPress={handleModalToggle} />
          <CommentList animalId={animalId} />
          <View style={styles.footer}>
            <CommentForm animalId={animalId} />
          </View>
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
  },
  btnComments: {
    backgroundColor: "#2f2f2f",
  },
  footer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f8f8f8",
    borderTopColor: "#e8e8e8",
    borderTopWidth: 1,
    padding: 10,
  },
});

export default CommentSection;
