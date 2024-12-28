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
  },
});

export const { addNewDonation, resetUnreadDonations } = notificationsSlice.actions;
export default notificationsSlice.reducer;