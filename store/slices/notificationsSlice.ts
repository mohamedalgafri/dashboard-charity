// store/slices/notificationsSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    unreadDonations: 0,
    unreadMessages: 0,
  },
  reducers: {
    addNewDonation: (state) => {
      state.unreadDonations += 1;
    },
    resetUnreadDonations: (state) => {
      state.unreadDonations = 0;
    },
    addNewMessage: (state) => {
      state.unreadMessages += 1;
    },
    resetUnreadMessages: (state) => {
      state.unreadMessages = 0;
    },
    setUnread: (state, action) => {
      state.unreadDonations = action.payload.unreadDonations;
      state.unreadMessages = action.payload.unreadMessages;
    }
  },
});

export const { 
  addNewDonation, 
  resetUnreadDonations,
  addNewMessage,
  resetUnreadMessages,
  setUnread 
} = notificationsSlice.actions;

export default notificationsSlice.reducer;