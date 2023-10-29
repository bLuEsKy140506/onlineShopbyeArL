"use client";

import { configureStore } from "@reduxjs/toolkit";
import exchangeValueReducer from "./features/userCartExchangeRateSlice";
import cartItemReducer from "./features/userCartCounterSlice";
import cartArrayReducer from "./features/userCartArraySlice";
import cartArrayConfirmReducer from "./features/userConfirmCart";

export const store = configureStore({
  reducer: {
    exchangeValue: exchangeValueReducer,
    cartItem: cartItemReducer,
    cartArray: cartArrayReducer,
    cartArrayConfirm: cartArrayConfirmReducer,
  },
});
