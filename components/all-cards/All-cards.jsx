"use client";

import SearchBox from "../search-box/search-box.component";
import Products from "@/components/Products";
import BrandListDisplay from "../nofunctionYet/BrandListDisplay";
import CategoryListDisplay from "../nofunctionYet/CategoryListDisplay";
import "./All-card.css";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import {
  changeArray,
  fetchCartArray,
} from "@/redux/features/userCartArraySlice";
import {
  fetchCartItems,
  setCounter,
} from "@/redux/features/userCartCounterSlice";

export default function AllCard({ data }) {
  const [ccount, setccount] = useState(6);
  const [filteredProduct, setFiltererdProduct] = useState(data);
  const [searchField, setSearchField] = useState("");
  const [myPosts, setMyPosts] = useState([]);
  const { items, _id } = useSelector((state) => state.cartArray);
  const { counter } = useSelector((state) => state.cartItem);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const newfilteredProduct = data.filter((product) => {
      return product.title.toLocaleLowerCase().includes(searchField);
    });
    setFiltererdProduct(newfilteredProduct);
  }, [data, searchField, counter]);

  useEffect(() => {
    if (!session?.user.id && localStorage.getItem("cartNotLogIn") !== null) {
      let temp = JSON.parse(localStorage.getItem("cartNotLogIn"));
      dispatch(setCounter(temp.length));
    }
  }, [session?.user.id, dispatch]);

  useEffect(() => {
    if (session?.user.id) {
      dispatch(fetchCartArray(session?.user.id));
      dispatch(fetchCartItems(session?.user.id));
    }
  }, [counter, session?.user.id]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `https://onlineshopbyearl-bluesky140506.vercel.app/api/userss/${session?.user.id}/cart`
      );
      const data = await response.json();

      setMyPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);
  const onSearchChange = (event) => {
    const searchFieldString = event.target.value.toLocaleLowerCase();
    setSearchField(searchFieldString);
    if (searchField === "") {
      setccount(6);
    }
  };
  const updatedCart = (msg) => {
    if (msg === "delete") {
      dispatch(changeArray([]));
      dispatch(setCounter(0));
    } else {
      dispatch(fetchCartArray(session?.user.id));
      dispatch(fetchCartItems(session?.user.id));
    }
  };

  return (
    <>
      <div className="main-page-filters">
        <h2 className="category">All goods</h2>
        <div className="categories-selection">
          <BrandListDisplay />
          <CategoryListDisplay />
        </div>
      </div>
      <div>
        {/*section is created when merging local cart to no server cart, just to notify the user to refresh */}
        {items === undefined && myPosts.length !== 0 && (
          <>{alert("Please refresh your page")}</>
        )}
        <SearchBox
          className="search-box"
          onChangeHandler={onSearchChange}
          placeholder="search product"
        />
        <div className="all-product-container" key={`id-group`}>
          {filteredProduct.map((item, index) => {
            if (ccount > index) {
              return (
                <div key={`${item.title}-${index}`}>
                  <Products
                    info={item}
                    items={items}
                    onUpdateCartItem={updatedCart}
                    objId={_id}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className="flex justify-center">
        {ccount < filteredProduct.length && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => setccount(ccount + 6)}
          >
            LOAD MORE
          </button>
        )}
      </div>
    </>
  );
}
