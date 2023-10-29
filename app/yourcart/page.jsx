"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import MyOrdered from "../ordered/page";
import {
  changeArray,
  fetchCartArray,
} from "@/redux/features/userCartArraySlice";
import { fetchCartItems } from "@/redux/features/userCartCounterSlice";
import { setCounter } from "@/redux/features/userCartCounterSlice";
import { changeArrayConfirm } from "@/redux/features/userConfirmCart";
import { signIn, useSession, getProviders } from "next-auth/react";

import "./cart_style.css";

const Cart = () => {
  //VARIABLE SECTION -----------------------------------------------------------------------------------------------------------------------------
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { _id, items } = useSelector((state) => state.cartArray);
  const { name, rate } = useSelector((state) => state.exchangeValue);
  const { counter } = useSelector((state) => state.cartItem);
  const [localdata, setLocalData] = useState([]);
  const router = useRouter();
  const symbols = {
    USD: "$",
    PHP: "₱",
    AUD: "A$",
    CAD: "C$",
    PLN: "zł",
    MXN: "mx$",
    EUR: "€",
  };

  let sign;
  let dollarsToEuro = 1 / 1.057861;

  const [providers, setProviders] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

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

  //USE EFFECT SECTION ------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  useEffect(() => {
    if (!session?.user.id && localStorage.getItem("cartNotLogIn") !== null) {
      let temp = JSON.parse(localStorage.getItem("cartNotLogIn"));
      dispatch(setCounter(temp.length));
      setLocalData(temp);
    }
  }, [dispatch, session?.user.id]);

  useEffect(() => {
    if (session?.user.id) {
      dispatch(fetchCartArray(session?.user.id));
      dispatch(fetchCartItems(session?.user.id));
    }
  }, [counter, session?.user.id]);

  // NO USER FUNCTIONS START----------------------------------------------------------------------------------------------------------------------------------
  const incrementItemTemp = (info) => {
    if (!session?.user.id) {
      let itemFetch = JSON.parse(localStorage.getItem("cartNotLogIn"));

      if (itemFetch?.some((item) => item.title === info.title)) {
        const index = itemFetch.findIndex((item) => item.title === info.title);

        itemFetch[index] = {
          ...itemFetch[index],
          quantity: itemFetch[index].quantity + 1,
        };

        localStorage.setItem("cartNotLogIn", JSON.stringify(itemFetch));
        setLocalData(itemFetch);
      }
    }
  };

  const decrementItemTemp = (info) => {
    if (!session?.user.id) {
      let itemFetch = JSON.parse(localStorage.getItem("cartNotLogIn"));

      if (itemFetch?.some((item) => item.title === info.title)) {
        const index = itemFetch.findIndex((item) => item.title === info.title);

        itemFetch[index] = {
          ...itemFetch[index],
          quantity: itemFetch[index].quantity - 1,
        };
        if (itemFetch[index].quantity === 0) {
          itemFetch.splice(index, 1);
        }

        if (itemFetch.length === 0) {
          localStorage.removeItem("cartNotLogIn");
          dispatch(setCounter(0));
          setLocalData([]);
        } else {
          localStorage.setItem("cartNotLogIn", JSON.stringify(itemFetch));
          setLocalData(itemFetch);
        }
        dispatch(setCounter(itemFetch.length));
      }
    }
  };

  const handleDeleteTemp = (info) => {
    if (!session?.user.id) {
      let itemFetch = JSON.parse(localStorage.getItem("cartNotLogIn"));

      if (itemFetch?.some((item) => item.title === info.title)) {
        const index = itemFetch.findIndex((item) => item.title === info.title);

        itemFetch.splice(index, 1);

        if (itemFetch.length === 0) {
          localStorage.removeItem("cartNotLogIn");
          dispatch(setCounter(0));
          setLocalData([]);
        } else {
          localStorage.setItem("cartNotLogIn", JSON.stringify(itemFetch));
          setLocalData(itemFetch);
        }
        dispatch(setCounter(itemFetch.length));
      }
    }
  };

  // LOG IN USER SECTION ------------------------------------------------------------------------------------------------------------------------------
  const incrementItem = async (id) => {
    let index = items.findIndex((item) => item._id === id);

    let myCartClone = [...items];

    myCartClone[index] = {
      ...myCartClone[index],
      quantity: myCartClone[index].quantity + 1,
    };

    try {
      const response = await fetch(
        `https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/${_id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            creator: session?.user.id,
            items: myCartClone,
            currency: {
              name: name,
              rate: rate,
            },
          }),
        }
      );
      if (response.ok) {
        updatedCart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const decrementItem = async (id) => {
    let index = items?.findIndex((item) => item._id === id);

    let myCartClone = [...items];
    if (myCartClone[index].quantity > 1) {
      myCartClone[index] = {
        ...myCartClone[index],
        quantity: myCartClone[index].quantity - 1,
      };
      try {
        const response = await fetch(
          `https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/${_id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              creator: session?.user.id,
              items: myCartClone,
              currency: {
                name: name,
                rate: rate,
              },
            }),
          }
        );
        if (response.ok) {
          updatedCart();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("You cannot empty item on the cart");
    }
  };

  const handleDelete = async (id) => {
    let index = items?.findIndex((item) => item._id === id);

    let myCartClone = [...items];
    myCartClone?.splice(index, 1);

    if (myCartClone.length === 0) {
      try {
        const response = await fetch(
          `https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/${_id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          updatedCart("delete");

          console.log("object deleted");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await fetch(
          `https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/${_id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              creator: session?.user.id,
              items: myCartClone,
              currency: {
                name: name,
                rate: rate,
              },
            }),
          }
        );

        if (response.ok) {
          updatedCart();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (items?.length !== 0) {
    sign = symbols[name];
  }

  const handlePlaceOroder = async (e) => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    try {
      const response = await fetch(
        "https://onlineshopbyearl-bluesky140506.vercel.app/api/ordered/new",
        {
          method: "POST",
          body: JSON.stringify({
            userId: session?.user.id,
            items: items,
            currency: {
              name: name,
              rate: rate,
            },
            timestamp: timestamp,
          }),
        }
      );

      if (response.ok) {
        dispatch(changeArrayConfirm(items));
        alert("OK its been added");
        router.push("/ordered");

        try {
          const response = await fetch(
            `https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/${_id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            updatedCart("delete");
            // dispatch(fetchCartItems(session?.user.id));
            localStorage.removeItem("cartNotLogIn");
          }
        } catch (error) {
          console.log(error);
        }

        return <MyOrdered myCartFetch={items} />;
      }
    } catch (error) {
      console.log(error);
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
    <div className="cart-container">
      <h2 className="cart-header">Shopping Bag</h2>
      {/*section is created when merging local cart to no server cart, just to notify the user to refresh */}
      {items === undefined && myPosts.length !== 0 && (
        <>{alert("Please refresh your page")}</>
      )}
      {/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++====*/}
      {(session?.user.id && items?.length === 0 && myPosts?.lenghh === 0) ||
        (items === undefined && session?.user.id && myPosts?.length === 0 && (
          <h3>NO ITEM IN THE BAG</h3>
        ))}
      {session?.user.id && items !== undefined && (
        <div>
          <p className="cart-description">
            {items?.length} items in the shopping bag
          </p>
        </div>
      )}
      {/*LOG IN USER INTERFACE SECTION =============================================================================================================== */}
      <ul className="cart-list-container">
        {session?.user.id &&
          items !== undefined &&
          items.map((item) => (
            <li key={`${item._id}+`}>
              <div className="cart-list-items">
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="desktop-btn button-item-cart bg-white rounded-md p-2 inline-flex items-center justify-center text-blue-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Close menu</span>
                  <svg
                    className="h-8 w-8"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="switch-view-1">
                  <Link href={`/products/${item.id}`}>
                    <figure className="cart-thumbnail-container">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={50}
                        height={60}
                      />
                    </figure>
                  </Link>

                  <div className="switch-view">
                    <div className="cart-item-title-brand-cat">
                      <p className="cart-item-title"> {item.title}</p>

                      <div className="cart-item-brand-category">
                        <span className="cart-item-brand">{item.brand}</span>
                        <span className="cart-item-category">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        onClick={() => incrementItem(item._id)}
                        className="w-10 h-10 bg-white rounded-md p-2 inline-flex items-center justify-center text-blue-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      <span className="cart-item-counter">
                        {" "}
                        {item.quantity}
                      </span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        onClick={() => decrementItem(item._id)}
                        className="w-10 h-10 bg-white rounded-lg p-2 inline-flex items-center justify-center text-blue-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 12h-15"
                        />
                      </svg>
                    </div>
                  </div>

                  <span className="individual-price">
                    {sign}{" "}
                    {(item.price * dollarsToEuro * rate).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                  <span className="cart-sub-total">
                    {sign}{" "}
                    {(
                      item.quantity *
                      item.price *
                      dollarsToEuro *
                      rate
                    ).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </li>
          ))}

        {/*NO USER INTERFACE SECTION =============================================================================================================== */}
        {!session?.user.id &&
          localdata?.length !== 0 &&
          localdata?.map((item) => (
            <li key={`${item._id}`}>
              <div className="cart-list-items">
                <button
                  type="button"
                  onClick={() => handleDeleteTemp(item)}
                  className="desktop-btn button-item-cart bg-white rounded-md p-2 inline-flex items-center justify-center text-blue-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Close menu</span>
                  <svg
                    className="h-8 w-8"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="switch-view-1">
                  <Link href={`/products/${item.id}`}>
                    <figure className="cart-thumbnail-container">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={50}
                        height={60}
                      />
                    </figure>
                  </Link>
                  <div className="switch-view">
                    <div className="cart-item-title-brand-cat">
                      <p className="cart-item-title"> {item.title}</p>

                      <div className="cart-item-brand-category">
                        <span className="cart-item-brand">{item.brand}</span>
                        <span className="cart-item-category">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        onClick={() => incrementItemTemp(item)}
                        className="w-10 h-10 bg-white rounded-md p-2 inline-flex items-center justify-center text-blue-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      <span className="cart-item-counter">
                        {" "}
                        {item.quantity}
                      </span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        onClick={() => decrementItemTemp(item)}
                        className="w-10 h-10 bg-white rounded-lg p-2 inline-flex items-center justify-center text-blue-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 12h-15"
                        />
                      </svg>
                    </div>
                  </div>

                  <span className="individual-price">
                    {sign}{" "}
                    {(item.price * dollarsToEuro * rate).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                  <span className="cart-sub-total">
                    {sign}{" "}
                    {(
                      item.quantity *
                      item.price *
                      dollarsToEuro *
                      rate
                    ).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </li>
          ))}
      </ul>
      <div className="cart-footer">
        {/*LOG IN USER INTERFACE !!! TOTAL SECTION !!!=============================================================================================================== */}
        {session?.user.id && items !== undefined && (
          <div className="cart-grand-total">
            <span>Total: </span>
            <span> </span>
            <span>{sign}</span>
            {(
              items?.reduce(
                (acc, currentValue) =>
                  acc + currentValue.quantity * currentValue.price,
                0
              ) *
              rate *
              dollarsToEuro
            ).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </div>
        )}

        {/*NO USER INTERFACE !!! TOTAL SECTION !!!=============================================================================================================== */}
        {!session?.user.id && localdata?.length !== 0 && (
          <div className="cart-grand-total">
            <span>Total: </span>
            <span> </span>
            <span>{sign}</span>
            {(
              localdata?.reduce(
                (acc, currentValue) =>
                  acc + currentValue.quantity * currentValue.price,
                0
              ) *
              rate *
              dollarsToEuro
            ).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </div>
        )}

        {/*PLACE ORDER REGULATOR INTERFACE =============================================================================================================== */}
        <div className="placeOrder--signIn">
          <div>
            {" "}
            <Link href="/">
              <button className="continue-shopping-btn">
                Continue shopping
              </button>
            </Link>
          </div>

          <div className="not-login-container">
            <button
              className={
                !session?.user.id || items === undefined
                  ? `disabled`
                  : "place-order-btn"
              }
              onClick={handlePlaceOroder}
            >
              Place Order
            </button>
            {!session?.user.id && (
              <div className="not-login">
                <span> To place an order, </span>
                <>
                  {providers &&
                    session?.user.id === undefined &&
                    Object.values(providers).map((provider) => (
                      <span
                        className="signIn-cart"
                        key={provider.name}
                        onClick={() => {
                          signIn(provider.id);
                        }}
                      >
                        sign-in
                      </span>
                    ))}
                </>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
