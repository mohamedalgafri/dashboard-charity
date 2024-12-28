// store/slices/contactsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface ContactsState {
  items: Contact[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(item => !item.isRead).length;
    },
    addContact: (state, action: PayloadAction<Contact>) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markContactAsRead: (state, action: PayloadAction<string>) => {
      const contact = state.items.find(item => item.id === action.payload);
      if (contact && !contact.isRead) {
        contact.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    setContactsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setContactsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setContacts,
  addContact,
  markContactAsRead,
  setContactsLoading,
  setContactsError,
} = contactsSlice.actions;
export default contactsSlice.reducer;