import { PendingCheckoutDraft } from "@/lib/checkout-helpers";
import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  pendingCheckoutData: PendingCheckoutDraft | null;
  bookingId: string | null;
};

const initialState: InitialState = {
  pendingCheckoutData: null,
  bookingId: null,
};

const publicReducer = createSlice({
  name: "public",
  initialState,
  reducers: {
    setPendingCheckoutData: (
      state,
      action: {
        payload: {
          pendingCheckoutData: PendingCheckoutDraft | null;
          bookingId: string | null;
        };
      },
    ) => {
      state.pendingCheckoutData = action.payload.pendingCheckoutData;
      state.bookingId = action.payload.bookingId;
    },
  },
});

export const { setPendingCheckoutData } = publicReducer.actions;
export default publicReducer.reducer;
