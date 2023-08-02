import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFirestore, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

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