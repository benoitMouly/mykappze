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
import { createAndSendNotification } from "../../features/user/userSlice";
// import { Modal, Button, View, StyleSheet } from 'react-native';

const CommentForm = ({ animalId, animalName }) => {
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

    const message = 'Un commentaire a été ajouté pour l\'animal :  ' + animalName;
    const userIds = ['oo1qP9CNSYNvgzingDITVJ4XL3a2', 'zcsYehEmnLStL5twOUlP4Ee7FyK2', '4jEvW3mzCqO6GtLt4vHfYZxCHDI3'];
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
      {/* <Button title="Commenter"  /> */}
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

const CommentList = ({ animalId }) => {
  const { surname, uid } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments);
  const { data: users } = useSelector((state) => state.canalUsers);
  const [userIsAdmin, setUserRole] = useState({});
  const [isEditedCommentContentVisible, setEditVisible] = useState(false);
  const [editedCanalName, setEditedCommentContent] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  // const [currentCanalName, setCurrentCanalName] = useState(
  //     canal.name
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
      <ScrollView
        style={{ margin: 10, padding: 0, flexDirection: "column", rowGap: 10, marginBottom: 100 }}
      >
        {comments.map((comment) => (
          <View
            key={comment.id}
            style={{
              backgroundColor: "#2f4f4f",
              borderRadius: 2,
              padding: 20,
              marginTop: 10,
              flexDirection: "column",
              rowGap: 20,
            }}
          >
            <View style={styles.commentElt}>
              <Text style={styles.text}>{comment?.texte}</Text>
            </View>
            <View>
              <Text style={styles.textInfo}>Par {comment.auteur}, </Text>
              <Text style={styles.textInfo}>
                le {new Date(comment.horodatage).toLocaleString()}
              </Text>
            </View>

            {(comment.authorId === uid || userIsAdmin) && (
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 40,
                  justifyContent: "flex-end",
                }}
              >
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
                      size={18}
                      color="#fff"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(comment.id)}>
                  <Icon
                    style={styles.buttonIconElt}
                    name="close"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
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
        value={editedCanalName} // set the initial value of the text input to the current comment texte
      />
    </>
  );
};

const CommentSection = ({ animalId, commentsLength, animalName }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleModalToggle}
        style={styles.sectionBtns_btn}
      >
        <Text style={{ color: "white" }}>COMMENTAIRES ({commentsLength})</Text>
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

          <CommentList animalId={animalId} />

          <View style={styles.footer}>
            <CommentForm animalId={animalId} animalName={animalName}/>
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
    paddingTop: 20,
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
});

export default CommentSection;
