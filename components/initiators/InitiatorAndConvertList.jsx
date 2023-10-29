//http://data.fixer.io/api/latest?access_key=0ec2300dfadbfd2eabc14833cfce7cf8&symbols=USD,AUD,CAD,PLN,MXN,PHP&format=1

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchExchangeRate } from "@/redux/features/userCartExchangeRateSlice";
import { useSession } from "next-auth/react";
import { fetchCartItems } from "@/redux/features/userCartCounterSlice";
import ExchangeRateDisplay from "../navBar/zExchangeRateDisplay";
import { fetchCartArray } from "@/redux/features/userCartArraySlice";
export default function InitiatorAndConvertList({ data }) {
  const [myCart, setMyCart] = useState([]);
  const dispatch = useDispatch();

  const { data: session } = useSession();

  //INITIALIZE ----- CART INFO FOR THE EXCHANGE RATE AND CART COUNTER
  useEffect(() => {
    const fetchMyCart = async () => {
      const response = await fetch(`/api/userss/${session?.user.id}/cart`);
      const data = await response.json();

      setMyCart(data);
    };

    if (session?.user.id) fetchMyCart();
    if (session?.user.id && myCart.length === 0) {
      dispatch(fetchCartItems(session?.user.id));
      dispatch(fetchExchangeRate(session?.user.id));
      dispatch(fetchCartArray(session?.user.id));
    }
    if (session?.user.id) dispatch(fetchCartArray(session?.user.id));
  }, [session?.user.id, myCart?.length, dispatch]);

  return (
    <>
      <ExchangeRateDisplay currencies={data} />
    </>
  );
}
