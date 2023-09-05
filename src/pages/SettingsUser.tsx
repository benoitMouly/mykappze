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
  Switch
} from "react-native";
import { fetchCanals, removeCanal } from "../features/canals/canalSlice";
import TextInputModal from "../components/general/TextUpdateModal";
import {
  deleteUser,
  logout,
  updatePassword,
  updateUserEmail,
  updateUserName,
  updateUserSurname,
} from "../features/user/userSlice";
import { updateUserNotificationPreference } from "../features/notifications/notificationSlice";
import { removeUserFromCanal } from "../features/canals/canalUsersSlice";
import CustomAlert from "../components/general/CustomAlert";
import ConfirmationModal from "../components/general/ConfirmationModal";
import { HeaderEditAnimal } from "../components/general/headerEditAnimal";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchLicenseById } from "../features/licences/licenceSlice";
import { formatDateToFrench } from "../utils/formatDate";
import { PaymentsScreen } from "./Payments";
import { registerForPushNotificationsAsync } from "../features/notifications/notificationSlice";

const Settings = () => {
  //   const {
  //     params: { userId },
  //   } = useRoute();
  const {
    name,
    surname,
    email,
    isAuthenticated,
    uid,
    licenseNumber,
    isMairie,
    isAssociation,
    registrationDate,
    notificationsEnabled
  } = useSelector((state) => state.auth);
  const userId = uid;
  const { data: canals } = useSelector((state) => state.canals);
  const { data: users } = useSelector((state) => state.canalUsers);
  const stripeCustomerId = useSelector((state) => state.auth.stripeCustomerId);

  console.log(stripeCustomerId)

  const registrationDateObj = registrationDate

  const dispatch = useDispatch();
  const navigate = useNavigation();

  const [editableFields, setEditableFields] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationUnlinkedCanal, setShowConfirmationUnlinkCanal] =
    useState(false);
  const [showConfirmationDeleteCanal, setShowConfirmationDeleteCanal] =
    useState(false);

  const [selectedCanalId, setSelectedCanalId] = useState(null);
  const [creatorCanal, setCreatorCanal] = useState([]);
  const [userIsAdmin, setUserRole] = useState({});
  const [isEnabled, setIsEnabled] = useState(notificationsEnabled);

  console.log('isEnabled : ', isEnabled)
  const animalsStatus = useSelector((state) => state.animals.status);
  const canalsStatus = useSelector((state) => state.canals.status);
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
  const currentLicenseDetails = useSelector((state) => state.licences.license);

  useEffect(() => {
    if (isAuthenticated) {
      // Dispatch your fetchCanals action if needed
      dispatch(fetchLicenseById(licenseNumber));
    }
  }, [dispatch, userId, isAuthenticated, licenseNumber]);

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
      dispatch(fetchCanals(userId));
      if (uid && uid === userId) {
        let creatorCanals = [];

        for (let canal of canals) {
          if (Array.isArray(canal.role)) {
            for (let role of canal.role) {
              if (
                role.isAdmin === true &&
                role.uid === userId &&
                canal.adminId === userId
              ) {
                creatorCanals.push(canal);
                break;
              }
            }
          }
        }

        setCreatorCanal(creatorCanals);
      } else {
        setCreatorCanal([]);
      }
    }
  }, [dispatch, userId, isAuthenticated]);

  useEffect(() => {
    // Initialiser userRoles avec les rôles actuels des utilisateurs
    users.forEach((user) => {
      if (user.id === uid) {
        setUserRole(user.isAdmin);
      }
    });
  }, [users]);

  //   const openModal = (userId, canalId, message) => {
  //     setSelectedUserId(userId);
  //     setSelectedCanalId(canalId);
  //     setMessageType(message);
  //   };

  const openDeleteModal = (userId, canalId) => {
    setSelectedUserId(userId);
    setSelectedCanalId(canalId);
    setDeleteModal(true);
  };

  const openDeassociateModal = () => {
    setDeassociateModal(true);
  };

  const openDeleteAccountModal = (userId, canalId) => {
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

//   const toggleSwitch = () => {
//     setIsEnabled(previousState => !previousState);
//     // Ici, appelez également une fonction pour mettre à jour la base de données avec la nouvelle valeur.
    
//     dispatch(updateUserNotificationPreference({ newValue: !isEnabled, userId: userId }));
//     console.log('isEnabled : ', isEnabled)
// };

const toggleSwitch = async () => {
  const currentEnabledState = isEnabled;
  setIsEnabled(!currentEnabledState);

  if (!currentEnabledState) { // Si l'utilisateur essaie d'activer les notifications
      const token = await registerForPushNotificationsAsync();
      if (token) {
          // L'utilisateur a donné l'autorisation
          dispatch(updateUserNotificationPreference({ newValue: true, userId }));
          // (Optionnel) Si vous souhaitez enregistrer le token Expo en Firestore, faites-le ici.
      } else {
          // L'utilisateur n'a pas donné la permission ou il y a eu une erreur.
          // Pour refléter cela dans l'interface utilisateur, vous pourriez vouloir remettre le toggle à "off".
          setIsEnabled(false);
      }
  } else {
      // L'utilisateur essaie de désactiver les notifications.
      dispatch(updateUserNotificationPreference({ newValue: false, userId }));
  }

  console.log('isEnabled : ', !currentEnabledState);
};


  //   const handleConfirmSuppression = async () => {
  //     // console.log(id)
  //     await dispatch(
  //       removeUserFromCanal({
  //         userId: selectedUserId,
  //         canalId: canal.id,
  //       })
  //     );
  //     setConfirmationVisible(false); // Ferme la modale de confirmation
  //     setAlertMessage("L'utilisateur a été désassocié avec succès"); // Définir le message d'alerte
  //     setAlertVisible(true); // Affiche la modale d'alerte
  //     setSelectedUserId(null); // ferme la modale
  //   };

  const handleConfirmUnlinkCanal = async () => {
    // console.log(id)
    await dispatch(
      removeUserFromCanal({
        userId: selectedUserId,
        canalId: selectedCanalId,
      })
    );
    setConfirmationVisible(false); // Ferme la modale de confirmation
    setAlertMessage("L'utilisateur a été désassocié avec succès"); // Définir le message d'alerte
    setAlertVisible(true); // Affiche la modale d'alerte
    setSelectedUserId(null); // ferme la modale
  };

  const handleConfirmDeleteCanal = async () => {
    // console.log(id)
    await dispatch(
      removeCanal({
        userId: selectedUserId,
        canalId: selectedCanalId,
      })
    );
    setConfirmationVisible(false); // Ferme la modale de confirmation
    setAlertMessage("Le canal a été supprimée avec succès'"); // Définir le message d'alerte
    setAlertVisible(true); // Affiche la modale d'alerte
    setSelectedUserId(null); // ferme la modale
  };

  const handleDeleteUser = () => {
    dispatch(deleteUser());
    dispatch(logout());
  };

  const expiryDateFrench = formatDateToFrench(
    currentLicenseDetails?.expiryDate
  );

  // Add all your handler functions here

  return (
    <View style={styles.container}>
      {/* <> */}
      <HeaderEditAnimal navigation={navigate} animalName={surname} />
      <ScrollView style={styles.mainView}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 15, columnGap: 10}}>
          <Text style={{color:'#fff'}}>Activer les notifications</Text>
          <Switch
                value={isEnabled}
                onValueChange={toggleSwitch}
                trackColor={{ true: "#d15e41" }}
                thumbColor={"#122121"}
              />
        </View>
        <View style={{ padding: 20 }}>
          <Text style={styles.text}>{surname}</Text>
          <Text style={styles.text}>Inscrit depuis le {registrationDateObj?.toLocaleString()}</Text>
        </View>
        <View style={{ backgroundColor: "#fff" }}>
          <Text style={styles.title2}>
            Informations générales de l'utilisateur
          </Text>
        </View>
        <View style={styles.sectionGeneral}>
          <View style={styles.sectionBloc}>
            <View style={styles.inputsModify}>
              <View style={styles.inputModify}>
                <Text style={styles.text}>{name}</Text>
                <TouchableOpacity
                  onPress={() => setEditVisible(true)}
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
              <View style={styles.inputModify}>
                <Text style={styles.text}>{surname}</Text>
                <TouchableOpacity
                  onPress={() => setEditVisibleSurname(true)}
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
              <View style={styles.inputModify}>
                <Text style={styles.text}>{email}</Text>
                <TouchableOpacity
                  onPress={() => setEditVisibleEmail(true)}
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
              <View style={styles.inputModify}>
                <Text style={styles.text}>Modifier le mot de passe</Text>
                <TouchableOpacity
                  onPress={() => setEditVisiblePassword(true)}
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
            </View>
          </View>
        </View>

        {isMairie && (
          <>
            <View style={styles.sectionGeneral}>
              <View style={{ backgroundColor: "#fff" }}>
                <Text style={styles.title2}>Abonnement</Text>
              </View>
              <View style={styles.sectionBloc}>
                {licenseNumber ? (
                  <>
                    <Text style={styles.licences}>
                      Numéro de license : {licenseNumber}. La license expirera
                      le
                      {expiryDateFrench}
                    </Text>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigate.navigate("Subscribe")}
                    >
                      <Text style={styles.buttonTextSub}>
                        Renouveler la licence
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.buttonInvoices}
                      onPress={() => navigate.navigate("Invoices")}
                    >
                      <Text style={styles.buttonTextSub}>
                        Accéder à mes paiements
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.licences}>
                      Vous ne disposez pas d'un abonnement actif.
                    </Text>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigate.navigate("Subscribe")}
                    >
                      <Text style={styles.buttonTextSub}>
                        Obtenir une licence
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </>
        )}

        <View style={styles.sectionCanalMember}>
          {canals.length > 0 && (
            <>
              <View style={{ backgroundColor: "#fff" }}>
                <Text style={styles.title2}>Canaux dont vous êtes membres</Text>
              </View>
              <View style={styles.sectionBloc}>
                <View style={styles.inputsModify}>
                  {canals.map((canal, index) => (
                    <View style={styles.inputModify} key={index}>
                      {canal.adminId !== userId ? (
                        <>
                          <Text style={styles.text}>
                            {canal.name} ({userIsAdmin ? "admin" : "visiteur"})
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              openDeassociateModal(
                                uid,
                                canal.id,
                                "Se désassocier de ce canal ?"
                              )
                            }
                            style={styles.btnDeassociate}
                          >
                            <Text style={styles.btnDeassociateText}>
                              Retirer de vos canaux
                            </Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <Text style={styles.text}>
                          {canal.name} (Super admin)
                        </Text>
                      )}
                    </View>
                  ))}

                  
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.sectionCanalAdmin}>
        {creatorCanal.length > 0 && (<>
          <View style={{ backgroundColor: "#fff" }}>
            <Text style={styles.title2}>Canaux dont vous avez la gestion</Text>
          </View>
          <View style={styles.sectionBloc}>
            <View style={styles.inputsModify}>
              {creatorCanal.map((asso, index) => (
                <>
                  <View key={index} style={styles.inputModify}>
                    <Text
                      key={index}
                      style={styles.text}
                      numberOfLines={1}
                      ellipsizeMode="head"
                    >
                      {asso.name} (
                      {asso.adminId === userId ? "Super admin" : "admin"})
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        openDeleteModal(uid, asso.id, "Supprimer ce canal ?")
                      }
                      style={styles.btnSuppCanal}
                    >
                      <Text style={styles.btnSuppCanalText}>
                        Supprimer ce canal
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ))}
            </View>
          </View>

        </>)}

        </View>
        <View style={styles.suppAccount}>
          <View style={styles.sectionBloc}>
            <TouchableOpacity
              onPress={() => openDeleteAccountModal()}
              style={styles.btnSupp}
            >
              <Text style={styles.buttonSuppText}>SUPPRIMER LE COMPTE</Text>
            </TouchableOpacity>
          </View>
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
          onClose={() => setEditVisibleSurname(false)} // Fermeture de la modale
          onConfirm={handleUpdateSurname}
          messageType={"Entrer un nouveau prénom"}
          onChangeText={setEditedSurname}
        />

        <TextInputModal
          visible={isEditEmailVisible}
          onClose={() => setEditVisibleEmail(false)} // Fermeture de la modale
          onConfirm={handleUpdateEmail}
          messageType={"Entrez le nouvel email"}
          onChangeText={setEditedEmail}
        />

        <TextInputModal
          visible={isEditPasswordVisible}
          onClose={() => setEditVisiblePassword(false)} // Fermeture de la modale
          onConfirm={handleUpdatePassword}
          messageType={"Entrez le nouveau mot de passe"}
          onChangeText={setEditedPassword}
          secure={true}
        />

        <ConfirmationModal
          visible={deassociateModal}
          onClose={() => setDeassociateModal(false)}
          onConfirm={handleConfirmUnlinkCanal}
          messageType={"Voulez vous désassocier le compte ? "}
        />
        <ConfirmationModal
          visible={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={handleConfirmDeleteCanal}
          messageType={"Voulez vous supprimer le canal ?"}
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
        {/* </ScrollView> */}
      </ScrollView>
      {/* </> */}
    </View>
  );
};

const styles = {
  container: {
    height: "100%",
    backgroundColor: "#2F4F4F",
    // marginBottom: 150
    flexDirection: "column",
  },
  mainView: {
    backgroundColor: "#2F4F4F",
    // backgroundColor: "#075bb5",
    // padding: 20,
    height: "100%",
    paddingBottom: 100,
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
  sectionBloc: {
    padding: 20,
  },
  sectionCanalMember: {
    marginVertical: 10,
  },
  sectionCanalAdmin: {
    marginVertical: 10,
  },
  title2: {
    color: "#2f4f4f",
    fontSize: 19,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    marginLeft: 20,
  },
  inputsModify: {
    rowGap: 10,
    marginVertical: 20,
  },
  inputModify: {
    flexDirection: "row",
    columnGap: 10,
    flexWrap: "wrap",
    marginBottom: 20,
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
    color: "#122121",
    fontSize: 15,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
  },
  textInput: {},
  buttonsPicker: {
    backgroundColor: "#122121",
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
    backgroundColor: "#c40030",
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
  buttonGroupIcons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    backgroundColor: "black",
    borderRadius: 2,
    paddingTop: 1,
  },
  buttonIconElt: {
    margin: 7,
  },
  btnDeassociate: {
    backgroundColor: "#c40030",
    marginTop: 10
  },
  btnDeassociateText: {
    padding: 5,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: "center",
    fontSize: 10,
  },
  btnSuppCanal: {
    backgroundColor: "#c40030",
    width: "50%",
    marginTop: 10
  },
  btnSuppCanalText: {
    padding: 5,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
    textAlign: "center",
    fontSize: 10,
    
  },
  suppAccount: {
    paddingBottom: 100,
  },
  button: {
    backgroundColor: "#d15e41",
    padding: 8,
    borderRadius: 2,
    width: "100%",
  },

  buttonInvoices: {
    backgroundColor: "#122121",
    padding: 8,
    marginTop: 16,
    borderRadius: 2,
    width: "100%",
  },

  buttonTextSub: {
    textAlign: "center",
    color: "#fff",
  },
  licences: {
    color: "#fff",
    marginBottom: 20,
    fontFamily: "WixMadeforDisplay-Regular",
  },
};

export default Settings;
