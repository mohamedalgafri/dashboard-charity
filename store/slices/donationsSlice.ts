// store/slices/donationsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDonations } from '@/actions/donation';
import { DonationWithRelations } from '@/types';

interface DonationsState {
  items: DonationWithRelations[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DonationsState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchDonations = createAsyncThunk(
  'donations/fetchDonations',
  async () => {
    return await getDonations();
  }
);

const donationsSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    addDonation: (state, action: { payload: DonationWithRelations }) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = "حدث خطأ في جلب التبرعات";
      });
  },
});

export const { addDonation } = donationsSlice.actions;
export default donationsSlice.reducer;