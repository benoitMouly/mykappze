import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFirestore, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
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