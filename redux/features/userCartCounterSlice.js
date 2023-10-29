import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCartItems = createAsyncThunk("fetchCartItems", async (id) => {
  const res = await fetch(
    `https://onlineshopbyearl-bluesky140506.vercel.app/api/userss/${id}/cart`,
    {
      mode: "no-cors",
    }
  );
  return res.json();
});

export const cartItem = createSlice({
  name: "cartItem",
  initialState: {
    counter: 0,
  },
  reducers: {
    increment: (state) => {
      state.counter = state.counter + 1;
      return state;
    },
    decrement: (state) => {
      state.counter = state.counter - 1;
      return state;
    },
    setCounter: (state, action) => {
      if (action.payload !== 0) {
        state.counter = action.payload;
      } else {
        state.counter = 0;
      }

      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      if (action.payload.length === 0) {
        state.counter;
      } else {
        state.counter = action.payload[0].items.length;
      }
    });
  },
});

export const { setCounter, increment, decrement } = cartItem.actions;
export default cartItem.reducer;
