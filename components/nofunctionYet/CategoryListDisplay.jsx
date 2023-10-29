"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function CategoryListDisplay({ categorylist }) {
  const [category, setcategory] = useState("Brand");
  const dispatch = useDispatch();

  return (
    <div>
      <select
        onChange={(e) => {
          setcategory(e.target.value);
        }}
        className="categorylist"
      >
        {" "}
        <option key="default-value">Category</option>
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
