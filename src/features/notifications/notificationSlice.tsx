import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFirestore, collection, query, orderBy, limit, getDocs, where, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token;

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // console.log("finalStatus : ", existingStatus);
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "2215e4a8-f48a-4db8-86a5-8463fef7ce41",
        })
      ).data;
      // token = (await Notifications.getExpoPushTokenAsync({projectId: '2215e4a8-f48a-4db8-86a5-8463fef7ce41'})).data;
      // console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }
  } catch (error) {
    console.log(error);
  }

  return token;
}


const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const db = getFirestore();
      const notificationsRef = collection(db, 'notifications');
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const q = query(notificationsRef, where('date', '>=', oneMonthAgo), orderBy('date', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push(doc.data());
      });
      
      return notifications;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);



// export const createAndSendNotification = createAsyncThunk(
//   "notifications/createAndSend",
//   async ({ userIds, message }, thunkAPI) => {
//       try {
//           const db = getFirestore();
//           const notificationsEnabledUsers = [];

//           // Parcourez chaque userId et vérifiez la préférence de notification
//           for (let userId of userIds) {
//               const userRef = doc(db, "users", userId);
//               const userDoc = await getDoc(userRef);
//               const userData = userDoc.data();

//               if (userData && userData.notificationsEnabled) {
//                   notificationsEnabledUsers.push(userId);
//               }
//           }

//           // Créez la notification dans Firestore uniquement pour les utilisateurs qui ont activé les notifications
//           // if (notificationsEnabledUsers.length > 0) {
//               const notificationsCollection = collection(db, "notifications");
//               await addDoc(notificationsCollection, {
//                   userIds,
//                   message,
//                   view: false,
//                   date: Date.now(),
//               });
//           // }
//       } catch (error) {
//           console.log(error);
//           return thunkAPI.rejectWithValue(error.toString());
//       }
//   }
// );

export const createAndSendNotification = createAsyncThunk(
  "notifications/createAndSend",
  async ({ userIds, message, subject }, thunkAPI) => {
    try {
      const db = getFirestore();
      const notificationsEnabledUsers = [];

      // Parcourez chaque userId et vérifiez la préférence de notification
      for (let userId of userIds) {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData && userData.notificationsEnabled === true) {
          notificationsEnabledUsers.push(userId);

          console.log('notificationsEnabledUsers -> ', notificationsEnabledUsers)
          console.log('userIds -> ', userIds)
        }
      }

      // Créez la notification dans Firestore uniquement pour les utilisateurs qui ont activé les notifications
      // if (notificationsEnabledUsers.length > 0) {
      const notificationsCollection = collection(db, "notifications");
      await addDoc(notificationsCollection, {
        notificationsEnabledUsers,
        message,
        subject,
        view: false,
        date: Date.now(),
      });
      // }
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.toString());
    }
  }
);

export const updateUserNotificationPreference = createAsyncThunk(
  "notifications/updateUserNotificationPreference",
  async ({ newValue, userId }) => {
    console.log('New value->', newValue)
    console.log('userId-> ', userId)
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", userId); // Assurez-vous d'avoir l'userId

      await updateDoc(userRef, { notificationsEnabled: newValue });
    } catch (error) {
      console.error("Error updating user notification preference: ", error);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add notifications to the state array
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export { fetchNotifications };
export default notificationsSlice.reducer;