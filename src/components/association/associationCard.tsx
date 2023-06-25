import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation type
type RootStackParamList = {
    Login: undefined;
    Home: undefined;
  };
  
  type AssociationDetailsScreen = StackNavigationProp<RootStackParamList, 'AssociationDetails'>;

const AssociationCard = ({ association }) => {
    const navigation = useNavigation<AssociationDetailsScreen>();
  
  const handlePress = () => {
    navigation.navigate('AssociationDetails', { associationId: association.id });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{association.name}</Text> 
      <Button title="Voir les détails" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
container: {

},
text: {

}
})

export default AssociationCard;