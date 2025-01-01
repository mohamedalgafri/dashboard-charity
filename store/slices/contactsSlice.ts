// store/slices/contactsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContacts } from '@/actions/contact';

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
  isLoading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  items: [],
  isLoading: true,
  error: null
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async () => {
    return await getContacts();
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) {
        state.items = [action.payload, ...state.items];
      }
    },
    updateContacts: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state) => {
        state.isLoading = false;
        state.items = [];
        state.error = "حدث خطأ في جلب الرسائل";
      });
  },
});

export const { addContact, updateContacts } = contactsSlice.actions;
export default contactsSlice.reducer;