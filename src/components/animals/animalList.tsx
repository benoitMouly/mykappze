// // AnimalList.tsx
// import React, { useState, useCallback } from 'react';
// import { FlatList, Text, View, StyleSheet } from 'react-native';
// import AnimalCard from './animalCard';

// interface Animal {
//   id: string;
//   name: string;
//   image?: string;
//   sex: string;
//   isMother: boolean;
//   cityName: string;
//   sectorName: string;
// }

// interface AnimalListProps {
//   animals: Animal[];
// }

// const AnimalList: React.FC<AnimalListProps> = ({ animals }) => {
//   const [displayedAnimals, setDisplayedAnimals] = useState<Animal[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 2;
// //   console.log(displayedAnimals)

//   const loadMoreAnimals = useCallback(() => {
//     const newAnimals = animals.slice(0, (currentPage + 1) * itemsPerPage);
//     setDisplayedAnimals(newAnimals);
//     setCurrentPage(currentPage + 1);
//   }, [animals, currentPage]);

//   return (
//     <FlatList
//       data={animals}
//       renderItem={({ item }) => <AnimalCard key={item.id} animal={item} />}
//       keyExtractor={item => item.id}
//       onEndReached={loadMoreAnimals}
//       onEndReachedThreshold={0.1}
//     />
//   );
// };

// export default AnimalList;

import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AnimalCard from './animalCard';

interface Animal {
  id: string;
  name: string;
  image?: string;
  sex: string;
  isMother: boolean;
  cityName: string;
  sectorName: string;
}

interface AnimalListProps {
  animals: Animal[];
}

const AnimalList: React.FC<AnimalListProps> = ({ animals }) => {
  const [displayedAnimals, setDisplayedAnimals] = useState<Animal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(animals.length / itemsPerPage);

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
    <View style={styles.container}>
      {/* <SafeAreaView style={{flex: 1}}> */}
      {displayedAnimals.length > 0 ? (
              <FlatList
              data={displayedAnimals}
              renderItem={({ item }) => <AnimalCard key={item.id} animal={item} />}
              keyExtractor={item => item.id}
              numColumns={2}
              contentContainerStyle={styles.flatListContent}
            />
            
      ) : (              <View>
                <Text>Aucun animal</Text>
              </View>)
            }
      {displayedAnimals.length > 0 ? (
              <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <Text style={styles.paginationButtonText}>Précédent</Text>
              </TouchableOpacity>
              <Text style={styles.paginationText}>{currentPage} / {totalPages}</Text>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.paginationButtonText}>Suivant</Text>
              </TouchableOpacity>
            </View>
      ) : (null)}
      {/* </SafeAreaView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

export default AnimalList;

