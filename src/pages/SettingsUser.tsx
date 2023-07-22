import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  fetchAssociations,
  removeAssociation,
} from "../features/associations/associationSlice";
import TextInputModal from "../components/general/TextUpdateModal";
import {
  deleteUser,
  logout,
  updatePassword,
  updateUserEmail,
  updateUserName,
  updateUserSurname,
} from "../features/user/userSlice";
import { removeUserFromAssociation } from "../features/associations/associationUsersSlice";
import CustomAlert from "../components/general/CustomAlert";
import ConfirmationModal from "../components/general/ConfirmationModal";

const Settings = () => {
  //   const {
  //     params: { userId },
  //   } = useRoute();
  const { name, surname, email, isAuthenticated, uid } = useSelector(
    (state) => state.auth
  );
  const userId = uid;
  const { data: associations } = useSelector((state) => state.associations);
  const { data: users } = useSelector((state) => state.associationUsers);
  //   const user =

  const dispatch = useDispatch();
  const navigate = useNavigation();

  const [editableFields, setEditableFields] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [
    showConfirmationUnlinkedAssociation,
    setShowConfirmationUnlinkAssociation,
  ] = useState(false);
  const [
    showConfirmationDeleteAssociation,
    setShowConfirmationDeleteAssociation,
  ] = useState(false);

  const [selectedAssociationId, setSelectedAssociationId] = useState(null);
  const [creatorAssociation, setCreatorAssociation] = useState([]);
  const [userIsAdmin, setUserRole] = useState({});

  const sectorsStatus = useSelector((state) => state.sectors.status);
  const animalsStatus = useSelector((state) => state.animals.status);
  const associationsStatus = useSelector((state) => state.associations.status);
  const [isEditNameVisible, setEditVisible] = useState(false);
  const [isEditSurnameVisible, setEditVisibleSurname] = useState(false);
  const [isEditEmailVisible, setEditVisibleEmail] = useState(false);
  const [isEditPasswordVisible, setEditVisiblePassword] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedSurname, setEditedSurname] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deassociateModal, setDeassociateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Dispatch your fetchAssociations action if needed
    }
  }, [dispatch, userId, isAuthenticated]);

  //   useEffect(() => {
  //     if (uid && uid === userId) {
  //       const fields = [
  //         { key: "name", label: "Nom utilisateur", value: name },
  //         { key: "surname", label: "Prénom utilisateur", value: surname },
  //         { key: "email", label: "Email utilisateur", value: email },
  //         { key: "password", label: "Modifier le mot de passe", value: "" }, // Update this line to remove the password value
  //       ];
  //       setEditableFields(fields);
  //     } else {
  //       setEditableFields([]);
  //     }
  //   }, [userId]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAssociations(userId));
      if (uid && uid === userId) {
        let creatorAssociations = [];

        for (let association of associations) {
          if (Array.isArray(association.role)) {
            for (let role of association.role) {
              if (role.isAdmin === true && role.uid === userId) {
                creatorAssociations.push(association);
                break;
              }
            }
          }
        }

        setCreatorAssociation(creatorAssociations);
      } else {
        setCreatorAssociation([]);
      }
    }
  }, [dispatch, userId, isAuthenticated]);

  //   const openModal = (userId, associationId, message) => {
  //     setSelectedUserId(userId);
  //     setSelectedAssociationId(associationId);
  //     setMessageType(message);
  //   };

  const openDeleteModal = (userId, associationId) => {
    setSelectedUserId(userId);
    setSelectedAssociationId(associationId);
    setDeleteModal(true);
  };

  const openDeassociateModal = () => {
    setDeassociateModal(true);
  };

  const openDeleteAccountModal = (userId, associationId) => {
    setDeleteAccountModal(true);
  };

  const handleUpdateName = (newName) => {
    dispatch(updateUserName({ userId: userId, newName: newName }));
    setEditVisible(false);
    // dispatch(logout());
  };

  const handleUpdateSurname = (newSurname) => {
    dispatch(updateUserSurname({ userId: userId, newSurname: newSurname }));
    // dispatch(logout());
    setEditVisibleSurname(false);
  };

  const handleUpdateEmail = (newEmail) => {
    dispatch(updateUserEmail({ userId: userId, newEmail }));
    setEditVisibleEmail(false);
    dispatch(logout());
  };

  const handleUpdatePassword = (newPassword) => {
    dispatch(updatePassword(newPassword));
    setEditVisiblePassword(false);
    // dispatch(logout());
  };

  //   const handleConfirmSuppression = async () => {
  //     // console.log(id)
  //     await dispatch(
  //       removeUserFromAssociation({
  //         userId: selectedUserId,
  //         associationId: association.id,
  //       })
  //     );
  //     setConfirmationVisible(false); // Ferme la modale de confirmation
  //     setAlertMessage("L'utilisateur a été désassocié avec succès"); // Définir le message d'alerte
  //     setAlertVisible(true); // Affiche la modale d'alerte
  //     setSelectedUserId(null); // ferme la modale
  //   };

  const handleConfirmUnlinkAssociation = async () => {
    // console.log(id)
    await dispatch(
      removeUserFromAssociation({
        userId: selectedUserId,
        associationId: selectedAssociationId,
      })
    );
    setConfirmationVisible(false); // Ferme la modale de confirmation
    setAlertMessage("L'utilisateur a été désassocié avec succès"); // Définir le message d'alerte
    setAlertVisible(true); // Affiche la modale d'alerte
    setSelectedUserId(null); // ferme la modale
  };

  const handleConfirmDeleteAssociation = async () => {
    // console.log(id)
    await dispatch(
      removeAssociation({
        userId: selectedUserId,
        associationId: selectedAssociationId,
      })
    );
    setConfirmationVisible(false); // Ferme la modale de confirmation
    setAlertMessage("L'association a été supprimée avec succès'"); // Définir le message d'alerte
    setAlertVisible(true); // Affiche la modale d'alerte
    setSelectedUserId(null); // ferme la modale
  };

  const handleDeleteUser = () => {
    dispatch(deleteUser());
    dispatch(logout());
  };

  // Add all your handler functions here

  return (
    <ScrollView style={styles.mainView}>
      <Text style={styles.title1}>Paramètres de {surname} :</Text>

      <View style={styles.sectionGeneral}>
        <Text style={styles.title2}>
          Informations générales de l'utilisateur
        </Text>

        <View style={styles.inputsModify}>
          <View style={styles.inputModify}>
            <Text style={styles.text}>{name}</Text>
            <TouchableOpacity
              onPress={() => setEditVisible(true)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputModify}>
            <Text style={styles.text}>{surname}</Text>
            <TouchableOpacity
              onPress={() => setEditVisibleSurname(true)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputModify}>
            <Text style={styles.text}>{email}</Text>
            <TouchableOpacity
              onPress={() => setEditVisibleEmail(true)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputModify}>
            <Text style={styles.text}>Modifier le mot de passe</Text>
            <TouchableOpacity
              onPress={() => setEditVisiblePassword(true)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.sectionAssociationMember}>
        {associations.length > 0 && (
          <>
            <Text style={styles.title2}>
              Associations dont vous êtes membres
            </Text>
            <View style={styles.inputsModify}>
              {associations.map((association, index) => (
                <View style={styles.inputModify} key={index}>
                  {association.adminId !== userId ? (
                    <>
                      <Text style={styles.text}>
                        {association.name} ({userIsAdmin ? "admin" : "visiteur"}
                        )
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          openDeassociateModal(
                            uid,
                            association.id,
                            "Se désassocier de cette association ?"
                          )
                        }
                        style={styles.sectionShare_button}
                      >
                        <Text style={styles.sectionShare_buttonText}>
                          Retirer de vos associations
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <Text style={styles.text}>
                      {association.name} (Super admin)
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.sectionAssociationAdmin}>
        <Text style={styles.title2}>
          Associations dont vous avez la gestion :{" "}
        </Text>

        <View style={styles.inputsModify}>
          {creatorAssociation.map((asso, index) => (
            <>
              <View key={index}>
                <Text key={index} style={styles.text}>
                  {asso.name} (
                  {asso.adminId === userId ? "Super admin" : "admin"})
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  openDeleteModal(uid, asso.id, "Supprimer cette association ?")
                }
                style={styles.sectionShare_button}
              >
                <Text style={styles.sectionShare_buttonText}>
                  Supprimer cette association
                </Text>
              </TouchableOpacity>
            </>
          ))}
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={() =>
            openDeleteAccountModal()
          }
          style={styles.btnSupp}
        >
          <Text style={styles.buttonSuppText}>SUPPRIMER LE COMPTE</Text>
        </TouchableOpacity>

        {/* Add all the other interface elements here */}
      </View>

      <TextInputModal
        visible={isEditNameVisible}
        onClose={() => setEditVisible(false)} // Fermeture de la modale
        onConfirm={handleUpdateName}
        messageType={"Entrer un nouveau nom"}
        onChangeText={setEditedName}
      />

      <TextInputModal
        visible={isEditSurnameVisible}
        onClose={() => setEditVisible(false)} // Fermeture de la modale
        onConfirm={handleUpdateSurname}
        messageType={"Entrer un nouveau prénom"}
        onChangeText={setEditedSurname}
      />

      <TextInputModal
        visible={isEditEmailVisible}
        onClose={() => setEditVisible(false)} // Fermeture de la modale
        onConfirm={handleUpdateEmail}
        messageType={"Entrez le nouvel email"}
        onChangeText={setEditedEmail}
      />

      <TextInputModal
        visible={isEditPasswordVisible}
        onClose={() => setEditVisible(false)} // Fermeture de la modale
        onConfirm={handleUpdatePassword}
        messageType={"Entrez le nouveau mot de passe"}
        onChangeText={setEditedPassword}
      />

      <ConfirmationModal
        visible={deassociateModal}
        onClose={() => setDeassociateModal(false)}
        onConfirm={handleConfirmUnlinkAssociation}
        messageType={"Voulez vous désassocier le compte ? "}
      />
      <ConfirmationModal
        visible={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleConfirmDeleteAssociation}
        messageType={"Voulez vous supprimer l'association ?"}
      />
      <ConfirmationModal
        visible={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        onConfirm={handleDeleteUser}
        messageType={"Voulez vous supprimer votre compte ?"}
      />
      <CustomAlert
        visible={isAlertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
      />
    </ScrollView>
  );
};

const styles = {
  mainView: {
    backgroundColor: "red",
    padding: 20,
  },
  title1: {
    color: "#FFF",
    fontSize: 32,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  sectionGeneral: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionAssociationMember: {
    marginVertical: 10,
  },
  sectionAssociationAdmin: {
    marginVertical: 10,
  },
  title2: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  inputsModify: {
    rowGap: 10,
    marginVertical: 20,
  },
  inputModify: {
    flexDirection: "row",
    columnGap: 10,
  },
  text: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  editAnimal: {
    padding: 5,
    flexDirection: "column",
    rowGap: 50,
  },
  editUnicalSection: {
    flexDirection: "column",
    rowGap: 20,
    // backgroundColor: 'blue',
    margin: 5,
  },
  editUnicalSectionTitle: {
    fontSize: 18,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  viewImg: {},
  editElt: {
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    height: 2,
    backgroundColor: "#000", // change this to fit your design
    // alignSelf: 'start',
    marginVertical: 20, // space above and below the line
    width: "40%", // change this to fit your design
  },
  editEltCheckboxes: {
    marginHorizontal: 15,
    flexDirection: "column",
  },
  editEltSelects: {
    marginHorizontal: 15,
    flexDirection: "column",
  },
  editEltDocuments: {
    marginHorizontal: 15,
    flexDirection: "column",
  },
  editEltLabel: {
    color: "#2F2F2F",
    fontSize: 15,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  textInput: {},
  buttonsPicker: {
    backgroundColor: "#2F2F2F",
    padding: 5,
    borderRadius: 3,
  },
  buttonText: {
    padding: 2,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
  },
  btnSectionSuppSave: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
    rowGap: 20,
  },
  btnSupp: {
    backgroundColor: "red",
  },
  buttonSaveText: {
    padding: 20,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: "center",
  },
  buttonSuppText: {
    padding: 20,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: "center",
  },
  btnSave: {
    backgroundColor: "green",
  },
};

export default Settings;
