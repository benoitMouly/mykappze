import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollViewBase,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {
  addDocumentToAnimal,
  deleteDocumentFromAnimal,
  deleteFileFromStorage,
  uploadSingleFile,
} from "../../features/animals/animalSlice";
import { createAndSendNotification } from "../../features/notifications/notificationSlice";
import { ScrollView } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import { useSelector } from "react-redux";

const CustomDocumentList = ({ animal, dispatch, userIsAdmin }) => {
  const [localDocuments, setLocalDocuments] = useState(animal.documents || []);
  const { data: users } = useSelector((state) => state.canalUsers);
  const handleDelete = (documentName) => {
    const proceedWithDeletion = async () => {
      try {
        await dispatch(deleteFileFromStorage(documentName));
        await dispatch(
          deleteDocumentFromAnimal({ animalId: animal.id, documentName })
        );
        setLocalDocuments((prevDocs) =>
          prevDocs.filter((doc) => doc.name !== documentName)
        );
      } catch (error) {
        Alert.alert("Erreur", "Impossible de supprimer le document");
      }
    };
  
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer ce document ?",
      [
        {
          text: "Annuler",
          onPress: () => console.log("Annulation de la suppression"),
          style: "cancel"
        },
        {
          text: "Oui, supprimer",
          onPress: proceedWithDeletion
        }
      ],
      { cancelable: false }
    );
  };
  

  const handleDownload = async (document) => {
    try {
      // Ouverture directe du PDF dans le navigateur
      await WebBrowser.openBrowserAsync(document.url);
    } catch (error) {
      alert("Erreur lors de l'ouverture du document.");
      console.error(error);
    }
  };

  const handleAddDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
        copyToCacheDirectory: true,
      });

      console.log(result);
      // Check if the user cancelled the document picker
      if (result.canceled) {
        return; // Exit the function
      }

      const documentsToAdd = Array.isArray(result) ? result : [result];
      const uploadedDocuments = [];

      for (const doc of documentsToAdd) {
        const adaptedDoc = {
          name: doc.assets[0].name,
          uri: doc.assets[0].uri,
          mimeType: doc.assets[0].mimeType,
          size: doc.assets[0].size,
        };

        console.log('ADAPTED DOC')
        const uploadedDoc = await uploadSingleFile(adaptedDoc, animal.name);
        uploadedDocuments.push(uploadedDoc);
      }

      // Dispatching the action to add the uploaded documents to the animal
      await dispatch(
        addDocumentToAnimal({
          animalId: animal.id, // Assuming animalId is in the component's scope
          documents: uploadedDocuments,
        })
      );

      setLocalDocuments((prevDocs) => [...prevDocs, ...uploadedDocuments]);
      const message =
        "Un document a été ajouté pour l'animal :  " + animal.name;
        let userIds = [];
        users.forEach(user => {
          userIds.push(user?.id)
        });
        dispatch(createAndSendNotification({ userIds, message }));
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter le document");
      console.log(error);
    }
  };

  return (
    <View style={styles.docsContainer}>
      <ScrollView style={styles.docsList}>
        {localDocuments.map((document) => (
          <View style={styles.docElt} key={document.name}>
            <Text style={{ flex: 1, marginRight: 10 }}>{document.name}</Text>

            <TouchableOpacity
              onPress={() => handleDownload(document)}
              style={styles.downloadContainer}
            >
              <Text style={styles.downloadText}>Télécharger</Text>
            </TouchableOpacity>

            {userIsAdmin && (
              <TouchableOpacity
                onPress={() => handleDelete(document.name)}
                style={styles.deleteContainer}
              >
                <Text style={styles.deleteText}>Supprimer</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={handleAddDocument} style={styles.btnAddDoc}>
        <Text style={styles.btnAddDocText}>Ajouter un document</Text>
      </TouchableOpacity>
    </View>
  );
};
export default CustomDocumentList;

const styles = StyleSheet.create({
  docsContainer: {
    flex: 1,
    position: "relative",
    // backgroundColor: "red",
  },
  docsList: {
    flex: 1,
    padding: 15,
  },
  docElt: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    columnGap: 10,
  },
  downloadContainer: {
    backgroundColor: "#2f4f4f",
    padding: 10,
  },
  downloadText: {
    color: "#fff",
    fontFamily: "WixMadeforDisplay-Regular",
    fontSize: 13,
  },
  deleteContainer: {
    backgroundColor: "rgb(135, 41, 41)",
    padding: 10,
  },
  deleteText: {
    color: "#fff",
    fontFamily: "WixMadeforDisplay-Regular",
    fontSize: 13,
  },
  btnAddDoc: {
    marginBottom: 50,
    padding: 15,
    borderWidth: 2,
    marginHorizontal: 20,
    borderRadius: 2,
  },
  btnAddDocText: {
    color: "#2f4f4f",
    textAlign: "center",
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 16,
  },
});
