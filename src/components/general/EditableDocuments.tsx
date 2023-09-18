import React from "react";
import { Button, TouchableOpacity, View, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadSingleFile } from "../../features/animals/animalSlice";

const EditableDocumentList = ({ animalName, documents, setDocuments, viewType }) => {
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
        uploadedDocuments.push(adaptedDoc);
      }
      setDocuments([...documents, ...uploadedDocuments]);
      // setIsDocModified(true)
      // setIsModified(true)
    } catch (err) {
      console.log(err);
    }
  };

  // Fonction pour supprimer un document de la liste
  const handleRemoveDocument = (documentToRemove) => {
    setDocuments(
      documents.filter((document) => document.url !== documentToRemove.url)
    );
    // setIsDocModified(true)
    // setIsModified(true)
  };



  return (
    <View style={{ paddingTop: 5, width: 240}}>
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
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ paddingRight: 10, width: 240, color: 'black' }}
          >
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

  // return (
  //   <View style={{ paddingTop: 5, backgroundColor: 'green' }}>
  //     <TouchableOpacity
  //       onPress={openMultipleDocumentPicker}
  //       style={styles.buttonsPicker}
  //     >
  //       <Text style={styles.buttonText}>Ajouter un document</Text>
  //     </TouchableOpacity>


  //     {documents && documents.map((document, index) => (
  //       <View
  //         key={index}
  //         style={{
  //           flexDirection: "row",
  //           alignItems: "center",
  //           marginBottom: 10,
  //         }}
  //       >
  //         <Text
  //           numberOfLines={2}
  //           ellipsizeMode="middle"
  //           style={{ paddingRight: 10, color: 'white' }}
  //         >
  //           {/* {document.assets[0].name} */}
  //           {document.name}
  //         </Text>
  //         <TouchableOpacity
  //           onPress={() => handleRemoveDocument(document)}
  //           style={styles.deleteButton}
  //         >
  //           <Text style={styles.buttonTextSupp}>Supprimer</Text>
  //         </TouchableOpacity>
  //       </View>
  //     ))}
  //   </View>
  // );
};

const styles = {
  buttonsPicker: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 2,
    marginBottom: 20,
    //   width: 100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#122'
  },
  deleteButton: {
    backgroundColor: "#872929", // couleur rouge
    padding: 5,
    borderRadius: 2,
    marginLeft: 10,
  },
  buttonText: {
    padding: 2,
    marginBottom: 4,
    color: "#122",
    fontFamily: "WixMadeforDisplay-Bold",
  },
  buttonTextSupp: {
    color: "white",
    fontFamily: "WixMadeforDisplay-Regular",
    fontSize: 13,
  },
};

export default EditableDocumentList;
