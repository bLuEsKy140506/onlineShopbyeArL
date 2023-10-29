import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCartArray = createAsyncThunk("fetchCartArray", async (id) => {
  const res = await fetch(
    `https://onlineshopbyearl-bluesky140506.vercel.app/api/userss/${id}/cart`,
    {
      cache: "no-store",
      mode: "no-cors",
    }
  );
  let response = res.json();
  return response;
});
/*
//THIS DATA IS STATIC BECAUSE THE API HAS LIMITED USAGE/CONSUMPTION FOR FREE USERS
  //SO I DECIDED TO TAKE THE LATEST DATA THEN MANUALLY INPUT HERE
  /*
 {
  "success": true,
  "timestamp": 1698584583,
  "base": "EUR",
  "date": "2023-10-29",
  "rates": {
    "USD": 1.057861,
    "AUD": 1.669867,
    "CAD": 1.468364,
    "PLN": 4.469122,
    "MXN": 19.163361,
    "PHP": 60.30127
  }
}
*/

const initialRate = { name: "USD", rate: 1.057861 };
const initialState = [];
export const cartArray = createSlice({
  name: "cartArray",
  initialState: initialState,
  reducers: {
    changeArray(state, action) {
      state = action.payload;
      return state;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCartArray.fulfilled, (state, action) => {
      let temp = JSON.parse(localStorage.getItem("cartNotLogIn")); //isolated storage of users PC

      if (temp !== null && action.payload[0] !== undefined) {
        let merged = temp.concat(action.payload[0].items);

        const uniqueObjects = {};
        merged.forEach((obj) => {
          // Use 'id' as the unique key
          const id = obj.title;
          if (uniqueObjects[id]) {
            // If the object already exists, add the values
            uniqueObjects[id].quantity += obj.quantity;
          } else {
            // If the object doesn't exist, create a new one
            uniqueObjects[id] = { ...obj };
          }
        });

        const resultArray = Object.values(uniqueObjects);

        fetch(
          `https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/${action.payload[0]._id.toString()}`,
          {
            method: "PUT",
            body: JSON.stringify({
              creator: action.payload[0].creator._id.toString(),
              items: resultArray,
              currency: action.payload[0].currency,
            }),
          }
        );

        state = [
          {
            _id: action.payload[0].creator._id.toString(),
            items: resultArray,
            currency: action.payload[0].currency,
          },
        ];
        localStorage.removeItem("cartNotLogIn");
        return state;
      } else if (action.payload[0] !== undefined && temp === null) {
        localStorage.removeItem("cartNotLogIn");
        state = action.payload[0];
        return state;
      } else if (temp !== null && action.payload[0] === undefined) {
        fetch(
          "https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/new",
          {
            method: "POST",
            body: JSON.stringify({
              userId: action.meta.arg.toString(),
              items: temp,
              currency: initialRate,
            }),
          }
        );
        state = [
          {
            creator: action.meta.arg.toString(),
            items: temp,
            currency: initialRate,
          },
        ];
        localStorage.removeItem("cartNotLogIn");
        return state;
      }
    });
  },
});

export const { changeArray } = cartArray.actions;
export default cartArray.reducer;
