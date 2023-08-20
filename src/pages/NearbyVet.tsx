// import React, { useEffect, useState } from "react";
// import { Text, View, FlatList, Platform } from "react-native";
// import Geolocation from "react-native-geolocation-service";
// import functions from "@react-native-firebase/functions";
// import { format, parse } from 'date-fns';
// import * as Location from "expo-location";
// import { getDistanceFromLatLonInKm } from "../utils/getDistance";

// interface Vet {
//   name: string;
//   distance: number;
//   hours: string[];
// }

// const Veterinaires = () => {
//   const [vets, setVets] = useState<Vet[]>([]);
//   const [msg, setErrorMsg] = useState("");

// // fonction pour convertir le format d'heure
// // Function to convert time to 24 hours format
// const convertTo24HourFormat = (timeString) => {
//     if (!timeString || timeString === "Closed" || timeString === "Open 24 hours") {
//       return timeString;
//     }

//     // Remplacer les caractères non standard par des caractères standard
//     const cleanedTimeString = timeString.replace(' ', ' ').replace('–', '*');

//     try {
//       const [startTime, endTime] = cleanedTimeString.split("*");

//       // Utiliser date-fns pour convertir le format de l'heure
//       const startTime24 = format(parse(startTime.trim(), "h:mm a", new Date()), "HH:mm");
//       const endTime24 = format(parse(endTime.trim(), "h:mm a", new Date()), "HH:mm");

//       return `${startTime24} - ${endTime24}`;
//     } catch (error) {
//         console.log("Attempting to convert:", timeString); // Add this line
//       console.error("Error while converting time:", error);
//       return timeString; // Si la conversion échoue, retourner la chaîne originale
//     }
//   };

//   // Function to translate weekday to French
//   const translateDayOfWeek = (day) => {
//     const daysOfWeek = {
//       "Monday": "Lundi",
//       "Tuesday": "Mardi",
//       "Wednesday": "Mercredi",
//       "Thursday": "Jeudi",
//       "Friday": "Vendredi",
//       "Saturday": "Samedi",
//       "Sunday": "Dimanche"
//     };
//     return daysOfWeek[day] || day;
//   };

//   // Function to translate opening hours
//   const translateOpeningHours = (opening_hours) => {
//     if (!opening_hours) return ["Non disponible"];

//     const translatedHours = opening_hours.flatMap((hour) => {
//       const [day, times] = hour.split(": ");
//       const translatedDay = translateDayOfWeek(day);

//       // Handle multiple time ranges in a single day
//       const timeRanges = times.split(", ");
//       return timeRanges.map((timeRange) => {
//         if (timeRange === "Closed") return `${translatedDay}: Fermé`;

//         const [startTime, endTime] = timeRange.split(" – ");
//         const startTime24 = convertTo24HourFormat(startTime);
//         const endTime24 = convertTo24HourFormat(endTime);
//         return `${translatedDay}: ${startTime24} - ${endTime24}`;
//       });
//     });

//     return translatedHours;
//   };

//   useEffect(() => {
//     fetchLocation();
//   }, []);

//   const fetchLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       setErrorMsg("Permission to access location was denied");
//       return;
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     const { latitude, longitude } = location.coords;
//     fetchVets(latitude, longitude);
//   };

//   const fetchVets = async (latitude: number, longitude: number) => {
//     try {
//       const response = await fetch(
//         "https://us-central1-kappze.cloudfunctions.net/getNearbyVets",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ latitude, longitude }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error('HTTP error ' + response.status);
//       }

//       const res = await response.json();

//       console.log(res)

//       const data = res.results.map((place: any) => {
//         const distance = getDistanceFromLatLonInKm(
//           latitude,
//           longitude,
//           place.geometry.location.lat,
//           place.geometry.location.lng
//         );

//         const hours = place.opening_hours?.weekday_text
//         ? translateOpeningHours(place.opening_hours.weekday_text)
//         : ["Non disponible"];

//         return {
//           name: place.name,
//           distance: Math.round(distance * 100) / 100,
//           hours: place.opening_hours?.open_now ? "Ouvert maintenant" : "Fermé",
//           openingHours: hours,
//         };
//       });

//       setVets(data);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <View>
//       <FlatList
//         data={vets}
//         keyExtractor={(item) => item.name}
//         renderItem={({ item }) => (
//           <View style={{ backgroundColor: "white" }}>
//             <Text>Nom: {item.name}</Text>
//             <Text>Distance: {item.distance} km</Text>
//             <Text>Horaires:</Text>
//             <Text>{item.hours}</Text>
//       {item.openingHours.map((hour, index) => (
//         <Text key={index}>{hour}</Text>
//       ))}
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default Veterinaires;

import React, { useEffect, useState } from "react";
import { Text, View, FlatList, Platform, StyleSheet } from "react-native";
// import Geolocation from "react-native-geolocation-service";
// import functions from "@react-native-firebase/functions";
import * as Location from "expo-location";
import { getDistanceFromLatLonInKm } from "../utils/getDistance";
import { ScrollView } from "react-native-gesture-handler";

interface Vet {
  name: string;
  distance: number;
  hours: string[];
}

const Veterinaires = () => {
  const [vets, setVets] = useState<Vet[]>([]);
  const [msg, setErrorMsg] = useState("");

  const daysOfWeek = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  const convertPeriodsToOpeningHours = (periods) => {
    if (!periods) return ["Non disponible"];

    let hoursForDays = {};

    periods.forEach((period) => {
      const day = daysOfWeek[period.open.day];

      const openTime = `${period.open.time.slice(
        0,
        2
      )}:${period.open.time.slice(2)}`;
      const closeTime = `${period.close.time.slice(
        0,
        2
      )}:${period.close.time.slice(2)}`;

      // If there's already an opening period for the day, add this one to it, otherwise create a new one
      hoursForDays[day] = hoursForDays[day]
        ? [...hoursForDays[day], `${openTime} - ${closeTime}`]
        : [`${openTime} - ${closeTime}`];
    });

    return Object.entries(hoursForDays).map(([day, hours]) => {
      return `${day}: ${hours.join(", ")}`;
    });
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    fetchVets(latitude, longitude);
  };

  const fetchVets = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        "https://us-central1-kappze.cloudfunctions.net/getNearbyVets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude, longitude }),
        }
      );

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const res = await response.json();
      console.log(res);

      const data = res.results.map((place: any) => {
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          place.geometry.location.lat,
          place.geometry.location.lng
        );

        const hours = convertPeriodsToOpeningHours(
          place.opening_hours?.periods
        );

        return {
          name: place.name,
          distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          hours: hours,
        };
      });

      setVets(data);
    } catch (e) {
      console.error(e);
    }
  };

  console.log(vets);

  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.title1}>Vétérinaires à proximité :</Text>
        {vets.map((vet, index) => (
          <View key={index.toString()} style={styles.blocVet}>
            <View style={styles.blocVetContent}>
              <Text style={styles.labels}>Nom : </Text>
              <Text style={styles.data}>{vet.name}</Text>
            </View>
            <View style={styles.blocVetContent}>
              <Text style={styles.labels}>Distance : </Text>
              <Text style={styles.data}> {vet.distance} km</Text>
            </View>

            <View style={styles.blocVetContent}>
              <Text style={styles.labels}>Horaires : </Text>
              <Text style={styles.data}>{vet.hours.join(", ")}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Veterinaires;

const styles = StyleSheet.create({
  title1: {
    fontSize: 17,
    color: "#2f2f2f",
    padding: 10,
    marginTop: 0,
    fontFamily: "WixMadeforDisplay-Bold",
  },
  blocVet: {
    marginVertical: 20,
    width: '100%',
    borderBottomWidth: 2
  },
  blocVetContent: {
    flexDirection: "row",
    flexWrap: 'wrap'
    
  },
  labels: {
    fontSize: 15,
    color: "#2f2f2f",
    padding: 10,
    marginTop: 0,
    fontFamily: "WixMadeforDisplay-Bold",
  },
  data: {
    fontSize: 15,
    color: "#2f2f2f",
    padding: 10,
    marginTop: 0,
    fontFamily: "WixMadeforDisplay-Regular",
    width: '100%'
  },
});
