// // Header.tsx
// import React from 'react';
// // import { Text, View, TouchableOpacity } from 'react-native';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';

// type HeaderProps = {
//   navigation: any,
// };

// export const Header: React.FC<HeaderProps> = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image source={require('../../assets/transparent-without-circle.png')} style={styles.logo} /> 
//         <Text style={styles.title}>Kappze</Text>
//       </View>
//       <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
//         <Text style={styles.menuButtonText}>Menu</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 50,
//     paddingBottom: 20,
//     backgroundColor: '#fff',
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     width: 50,
//     height: 50,
//     marginRight: 10,
//   },
//   title: {
//     fontSize: 20,
//   },
//   menuButton: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     borderRadius: 5,
//   },
//   menuButtonText: {
//     fontSize: 16,
//   }
// });


import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

type HeaderProps = {
  navigation: any,
};

export const Header: React.FC<HeaderProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/transparent-without-circle.png')} style={styles.logo} /> 
        <Text style={styles.title}>Kappze</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
        <Icon name="menu-outline" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontFamily: "WixMadeforDisplay-Bold",
    fontSize: 20,
  },
  menuButton: {
    padding: 10,
  },
});
