// import React from 'react';
// // import './LoadingPage.css';

// // Remplacer par votre URL d'icône de patte de chat ou le chemin de votre icône
// // const catPawUrl = 'https://example.com/cat_paw.png';
// import catPawUrl from '../../assets/icon-paw.png';

// const LoadingPage = () => {
//     return (
//         <div className="loading-wrapper">

//             <div className="loading-wrapper-column">
//                 <div className="loading-wrapper-column-title">
//                     <h2 style={{ textAlign: 'center' }}>Kappze</h2>
//                 </div>
//                 <div className="loading-wrapper-column-paws">
//                     <div className="paw" style={{ backgroundImage: `url(${catPawUrl})` }} />
//                     <div className="paw" style={{ backgroundImage: `url(${catPawUrl})` }} />
//                     <div className="paw" style={{ backgroundImage: `url(${catPawUrl})` }} />

//                 </div>
//             </div>

//         </div>
//     );
// };

// export default LoadingPage;
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

const spinValue = new Animated.Value(0);
const pulseValue = new Animated.Value(0.5);

// Création de l'animation de rotation
// Animated.loop(
//   Animated.timing(spinValue, {
//     toValue: 1,
//     duration: 1100,
//     useNativeDriver: true
//   })
// ).start();

// Création de l'animation de pulsation
Animated.loop(
    Animated.sequence([
        Animated.timing(pulseValue, {
            toValue: 1,
            duration: 550,
            useNativeDriver: true
        }),
        Animated.timing(pulseValue, {
            toValue: 0.5,
            duration: 550,
            useNativeDriver: true
        })
    ])
).start();

const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
});

const LoadingScreen = ({ isLoading }) => {

    const [showLoading, setShowLoading] = useState(true);

    console.log('dedans')

    useEffect(() => {
        if (!isLoading) {
            // Si les données sont chargées avant la fin de l'animation, attendez la fin de l'animation pour cacher le composant
            setTimeout(() => {
                setShowLoading(false);
            }, 8500); // 2 secondes pour correspondre à la durée de l'animation
        }
    }, [isLoading]);

    if (!showLoading) {
        return null;
    }

    return (
        <View style={styles.loadingContainer}>
            <Animated.Image
                source={require('../../assets/kappze_logo_circle_noir_roigne.png')}
                style={[styles.loadingLogo, { transform: [{ rotate: spin }], opacity: pulseValue }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#2f4f4f',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingLogo: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    }
});

export default LoadingScreen;
