import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { changeRate } from "@/redux/features/userCartExchangeRateSlice";
import { useSession } from "next-auth/react";

export default function ExchangeRateDisplay({ currencies }) {
  const [exchange, setExchange] = useState("EUR");
  const dispatch = useDispatch();
  const name = useSelector((state) => state.exchangeValue);
  const { data: session } = useSession();

  const currencyName = Object.keys(currencies);
  return (
    <div>
      <select
        onChange={(e) => {
          setExchange(e.target.value);

          dispatch(
            changeRate({
              name: e.target.value,
              rate: currencies[e.target.value],
            })
          );
        }}
        className={
          session?.user.id
            ? "exchange-rate-list"
            : "exchange-rate-list disabled-dropdown"
        }
      >
        {" "}
        <option key="default-value">{name.name}</option>
        {currencyName.map((item) => {
          // if (item === currentCurrency.name) {
          //   return (
          //     <option key={item} selected="selected" defaultValue={item}>
          //       {item}
          //     </option>
          //   );
          // } else
          return (
            <option
              key={item}
              value={item}
              className="exchange-rate-list-items"
            >
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
}
