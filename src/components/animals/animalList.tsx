import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AnimalCard from "./animalCard";
import Icon from "react-native-vector-icons/Ionicons";

interface Animal {
  id: string;
  name: string;
  image?: string;
  sex: string;
  isMother: boolean;
  citySectorName: string;
}

interface AnimalListProps {
  animals: Animal[];
}

const AnimalList: React.FC<AnimalListProps> = ({ animals }) => {
  const [displayedAnimals, setDisplayedAnimals] = useState<Animal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(animals.length / itemsPerPage);

  // console.log(displayedAnimals)
  useEffect(() => {
    loadCurrentPageAnimals();
  }, []);

  const loadCurrentPageAnimals = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newAnimals = animals.slice(startIndex, endIndex);
    setDisplayedAnimals(newAnimals);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    loadCurrentPageAnimals();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    loadCurrentPageAnimals();
  }, [animals]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
      {/* <SafeAreaView style={{flex: 1}}> */}
      {displayedAnimals.length > 0 ? (
        <FlatList
          data={displayedAnimals}
          renderItem={({ item }) => <AnimalCard key={item.id} animal={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          nestedScrollEnabled={true}
          scrollEnabled={false}
        />
      ) : (
        <View>
          <Text>Aucun animal</Text>
        </View>
      )}
      {displayedAnimals.length > 0 ? (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={handlePreviousPage}
            disabled={currentPage === 1}
          >
            {/* <Text style={styles.paginationButtonText}>Précédent</Text> */}
            <Icon name={"chevron-back-outline"} size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.paginationText}>
            {currentPage} / {totalPages}
          </Text>
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
          >
            {/* <Text style={styles.paginationButtonText}>Suivant</Text> */}
            <Icon name={"chevron-forward-outline"} size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ) : null}
      {/* </SafeAreaView> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50
  },
  flatListContent: {
    paddingBottom: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 10,
    // marginBottom: 20,
    paddingBottom: 40
  },
  paginationButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  paginationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paginationText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
});

export default AnimalList;
