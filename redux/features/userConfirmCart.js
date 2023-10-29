import { createSlice } from "@reduxjs/toolkit";

export const cartArrayConfirm = createSlice({
  name: "cartArrayConfirm",
  initialState: [],
  reducers: {
    changeArrayConfirm(state, action) {
      state = action.payload;
      return state;
    },
  },
});

export const { changeArrayConfirm } = cartArrayConfirm.actions;
export default cartArrayConfirm.reducer;
