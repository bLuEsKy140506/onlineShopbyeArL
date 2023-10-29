"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function BrandListDisplay({ brandlist }) {
  const [brand, setbrandList] = useState("Brand");
  const dispatch = useDispatch();

  return (
    <div>
      <select
        onChange={(e) => {
          setbrandList(e.target.value);
        }}
        className="brandlist"
      >
        {" "}
        <option key="default-value">Brand</option>
        {/* {currencyName.map((item) => {
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
        })} */}
      </select>
    </div>
  );
}
