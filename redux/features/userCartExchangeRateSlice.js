import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchExchangeRate = createAsyncThunk(
  "fetchExchangeRate",
  async (id) => {
    const res = await fetch(
      `https://onlineshopbyearl-bluesky140506.vercel.app/api/userss/${id}/cart`,
      {
        mode: "no-cors",
      }
    );
    return res.json();
  }
);

const initialState = { name: "USD", rate: 1.057861 };
//THIS DATA IS STATIC BECAUSE THE API HAS LIMITED USAGE/CONSUMPTION FOR FREE USERS
//SO I DECIDED TO TAKE THE LATEST DATA THEN MANUALLY INPUT HERE
/*
 {
  "success": true,
  "timestamp": 1696062243,
  "base": "EUR",
  "date": "2023-09-30",
  "rates": {
    "USD": 1.058645,
    "PHP": 59.972748,
    "AUD": 1.646938,
    "CAD": 1.438751,
    "PLN": 4.632002,
    "MXN": 18.440428,
    "EUR": 1
  }
}
}
*/
///http://data.fixer.io/api/latest?access_key=705ba7415f31dde1c5a4e82c1bc453e9&symbols=USD,AUD,CAD,PLN,MXN,PHP&format=1

export const exchangeValue = createSlice({
  name: "exchangeValue",
  initialState: initialState,
  reducers: {
    changeRate(state, action) {
      state = action.payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExchangeRate.fulfilled, (state, action) => {
      if (action.payload.length === 0) {
        return state;
      } else {
        state = action.payload[0].currency;
        return state;
      }
    });
  },
});

export const { changeRate } = exchangeValue.actions;
export default exchangeValue.reducer;
