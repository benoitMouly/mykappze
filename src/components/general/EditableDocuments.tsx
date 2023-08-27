import React from "react";
import { Button, TouchableOpacity, View, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadSingleFile } from "../../features/animals/animalSlice";

const EditableDocumentList = ({ documents, setDocuments, setIsDocModified }) => {

  console.log('documents props : ', documents)
  const openMultipleDocumentPicker = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
        copyToCacheDirectory: true,
      });

      const documentsToAdd = Array.isArray(results) ? results : [results];
      const uploadedDocuments = [];
      for (const doc of documentsToAdd) {
        const adaptedDoc = {
          name: doc.assets[0].name,
          uri: doc.assets[0].uri,
          mimeType: doc.assets[0].mimeType,
          size: doc.assets[0].size
        };

        const uploadedDoc = await uploadSingleFile(adaptedDoc);
        uploadedDocuments.push(uploadedDoc);
      }
      setDocuments([...documents, ...uploadedDocuments]);
      setIsDocModified(true)
    } catch (err) {
      console.log(err);
    }
  };

  // Fonction pour supprimer un document de la liste
  const handleRemoveDocument = (documentToRemove) => {
    setDocuments(
      documents.filter((document) => document.uri !== documentToRemove.uri)
    );
    // setIsDocModified(true)
  };

  return (
    <View style={{ paddingTop: 5 }}>
      <TouchableOpacity
        onPress={openMultipleDocumentPicker}
        style={styles.buttonsPicker}
      >
        <Text style={styles.buttonText}>Ajouter un document</Text>
      </TouchableOpacity>


      {documents && documents.map((document, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            numberOfLines={2}
            ellipsizeMode="middle"
            style={{ paddingRight: 10, color: 'white' }}
          >
            {/* {document.assets[0].name} */}
            {document.name}
          </Text>
          <TouchableOpacity
            onPress={() => handleRemoveDocument(document)}
            style={styles.deleteButton}
          >
            <Text style={styles.buttonTextSupp}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = {
  buttonsPicker: {
    backgroundColor: "#2F2F2F",
    padding: 5,
    borderRadius: 3,
    marginBottom: 20,
    //   width: 100,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF0000", // couleur rouge
    padding: 5,
    borderRadius: 3,
    marginLeft: 10,
  },
  buttonText: {
    padding: 2,
    marginBottom: 4,
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
  },
  buttonTextSupp: {
    color: "white",
    fontFamily: "WixMadeforDisplay-Bold",
  },
};

export default EditableDocumentList;
