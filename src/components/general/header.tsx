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

// Header.tsx
import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as Font from "expo-font";

type HeaderProps = {
  navigation: any,
};

export const Header: React.FC<HeaderProps> = ({ navigation }) => {

    const [fontsLoaded, setFontsLoaded] = useState(false);

    const loadFonts = async () => {
      await Font.loadAsync({
        "WixMadeforDisplay-Regular": require("../../assets/fonts/WixMadeforDisplay-Regular.ttf"),
        "WixMadeforDisplay-Bold": require("../../assets/fonts/WixMadeforDisplay-Bold.otf"), // charge également la variante en gras
      });
      setFontsLoaded(true);
    };

    useEffect(() => {
        loadFonts();
      }, []);
      if (!fontsLoaded) {
        return <View />;
      } else {
        return (
            <View >  
              <View style={styles.container}>
              <View style={styles.logoContainer}>
              <Image source={require('../../assets/transparent-without-circle.png')} style={styles.logo} /> 
              <Text style={styles.title}>Kappze</Text>
            </View>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                  <Text style={styles.menuText}>Menu</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
      }


  };



  const styles = StyleSheet.create({

    container: {
        marginTop: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      logo: {
        width: 50,
        height: 50,
        marginRight: 10,
      },
      title: {
        fontSize: 20,
        fontFamily: "WixMadeforDisplay-Bold",
        fontWeight: "600",
      },
      menuText: {
        marginRight: 10,
        marginBottom: 20
      }
  });
