"use client";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  changeArray,
  fetchCartArray,
} from "@/redux/features/userCartArraySlice";
import { useSelector, useDispatch } from "react-redux";
import { useSession, getProviders } from "next-auth/react";
import {
  fetchCartItems,
  setCounter,
} from "@/redux/features/userCartCounterSlice";

import "./DetailedPage.css";
import { Rating, Typography } from "@material-tailwind/react";
export { Rating, Typography };

export default function DetailedPage({ info }) {
  //VARIABLE SECTION ----------------------------------------------------------------------------------------------------------
  const {
    id,
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    quantity,
  } = info;

  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [isMatch, setIsMatch] = useState(false);
  const [indexDB, setIndexDB] = useState(0);
  const [myPosts, setMyPosts] = useState([]);
  const { name, rate } = useSelector((state) => state.exchangeValue);
  const { _id, items } = useSelector((state) => state.cartArray);
  const { counter } = useSelector((state) => state.cartItem);
  const [localdata, setLocalData] = useState([]);
  const [providers, setProviders] = useState(null);
  let dollarsToEuro = 1 / 1.057861; //I manually put the conversion because the API given has limited API consumption/usage

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

  //USE EFFECT SECTION ------------------------------------------------------------------------------------------------------------
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
      let isMatchtemp = temp?.some((item) => item.title === info.title);
      const index = temp.findIndex((item) => item.title === info.title);
      dispatch(setCounter(temp.length));
      setIsMatch(isMatchtemp);
      setLocalData(temp);
      setIndexDB(index);
    }
  }, [session?.user.id, localdata.length, dispatch, info.title]);

  useEffect(() => {
    if (session?.user.id) {
      dispatch(fetchCartArray(session?.user.id));
      dispatch(fetchCartItems(session?.user.id));
    }

    if (session?.user.id && items !== undefined) {
      if (items?.some((item) => item.title === info.title)) {
        setIsMatch(true);
        const index = items.findIndex((item) => item.title === info.title);
        setIndexDB(index);
      }
    }
  }, [session?.user.id, counter, items, dispatch, info.title]);

  // NO USER FUNCTIONS START --------------------------------------------------------------------------------------------
  // --CREATE
  const createItemTemp = () => {
    if (!session?.user.id && localStorage.getItem("cartNotLogIn") === null) {
      localStorage.setItem(
        "cartNotLogIn",
        JSON.stringify([
          {
            id,
            title,
            description,
            price,
            discountPercentage,
            rating,
            stock,
            brand,
            category,
            thumbnail,
            quantity: 1,
          },
        ])
      );

      setLocalData([
        {
          id,
          title,
          description,
          price,
          discountPercentage,
          rating,
          stock,
          brand,
          category,
          thumbnail,
          quantity: 1,
        },
      ]);
      setIsMatch(true);
      dispatch(setCounter(1));
    } else {
      let itemFetch = JSON.parse(localStorage.getItem("cartNotLogIn"));
      itemFetch.push({
        id,
        title,
        description,
        price,
        discountPercentage,
        rating,
        stock,
        brand,
        category,
        thumbnail,
        quantity: 1,
      });
      localStorage.setItem("cartNotLogIn", JSON.stringify(itemFetch));
      setLocalData(itemFetch);
      dispatch(setCounter(itemFetch.length));
    }
  };
  // INCREMENT
  const incrementItemTemp = () => {
    if (!session?.user.id) {
      let itemFetch = JSON.parse(localStorage.getItem("cartNotLogIn"));

      if (itemFetch?.some((item) => item.title === info.title)) {
        const index = itemFetch.findIndex((item) => item.title === info.title);
        setIndexDB(index);

        itemFetch[index] = {
          ...itemFetch[index],
          quantity: itemFetch[index].quantity + 1,
        };

        localStorage.setItem("cartNotLogIn", JSON.stringify(itemFetch));
        setLocalData(itemFetch);
      }
    }
  };
  // DECREMENT
  const decrementItemTemp = () => {
    if (!session?.user.id) {
      let itemFetch = JSON.parse(localStorage.getItem("cartNotLogIn"));

      if (itemFetch?.some((item) => item.title === info.title)) {
        const index = itemFetch.findIndex((item) => item.title === info.title);
        setIndexDB(index);

        itemFetch[index] = {
          ...itemFetch[index],
          quantity: itemFetch[index].quantity - 1,
        };
        if (itemFetch[index].quantity === 0) {
          itemFetch.splice(index, 1);
        }

        if (itemFetch.length === 0) {
          localStorage.removeItem("cartNotLogIn");
          setIsMatch(false);
        } else {
          localStorage.setItem("cartNotLogIn", JSON.stringify(itemFetch));
          setLocalData(itemFetch);
        }
        dispatch(setCounter(itemFetch.length));
      }
    }
  };

  // NO USER FUNCTIONS END ----------------------------------------------------------------------------
  // LOG-IN USER FUNCTIONS START ----------------------------------------------------------------------------
  // CREATE
  const createItem = async (e) => {
    if (items === undefined) {
      console.log("try");
      try {
        const response = await fetch(
          "https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/new",
          {
            method: "POST",
            body: JSON.stringify({
              userId: session?.user.id,
              items: [
                {
                  id,
                  title,
                  description,
                  price,
                  discountPercentage,
                  rating,
                  stock,
                  brand,
                  category,
                  thumbnail,
                  quantity: 1,
                },
              ],
              currency: {
                name: name,
                rate: rate,
              },
            }),
          }
        );

        if (response.ok) {
          updatedCart();
          setIsMatch(true);
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
              items: [
                ...items,
                {
                  id,
                  title,
                  description,
                  price,
                  discountPercentage,
                  rating,
                  stock,
                  brand,
                  category,
                  thumbnail,
                  quantity: 1,
                },
              ],
              currency: {
                name: name,
                rate: rate,
              },
            }),
          }
        );
        if (response.ok) {
          updatedCart();
          setIsMatch(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  //INCREMENT
  const incrementItem = async () => {
    let myCartClone = [...items];
    myCartClone[indexDB] = {
      ...myCartClone[indexDB],
      quantity: myCartClone[indexDB].quantity + 1,
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
  //DECREMENT
  const decrementItem = async () => {
    let isPresence;

    let myCartClone = [...items];
    myCartClone[indexDB] = {
      ...myCartClone[indexDB],
      quantity: myCartClone[indexDB].quantity - 1,
    };

    if (myCartClone[indexDB].quantity === 0) {
      myCartClone.splice(indexDB, 1);
    }

    if (myCartClone.length === 0) {
      try {
        const response = await fetch(`/api/cart/${_id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsMatch(false);
          updatedCart("delete");
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      isPresence = myCartClone.some((item) => item.title === info.title);

      try {
        const response = await fetch(`/api/cart/${_id}`, {
          method: "PUT",
          body: JSON.stringify({
            creator: session?.user.id,
            items: myCartClone,
            currency: {
              name: name,
              rate: rate,
            },
          }),
        });

        if (response.ok && isPresence === false) {
          setIsMatch(false);
          updatedCart();
        }
        if (response.ok && isPresence === true) {
          updatedCart();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updatedCart = (msg) => {
    if (msg !== "delete") {
      dispatch(fetchCartArray(session?.user.id));
      dispatch(fetchCartItems(session?.user.id));
    } else {
      dispatch(fetchCartItems(session?.user.id));
      dispatch(changeArray([]));
      dispatch(setCounter(0));
    }
  };

  sign = symbols[name];
  // LOG-IN USER FUNCTIONS END ----------------------------------------------------------------------------
  return (
    <div className="detailedPage-main-container">
      <div className="images-container">
        <Image
          src={info.images[0]}
          alt="sample-card"
          className="card-img-detailed"
          width={500}
          height={320}
        />
        <div className="other-images">
          {info.images[1] !== undefined && (
            <Image
              src={info.images[1]}
              alt="sample-card"
              className="card-img-other"
              width={140}
              height={140}
            />
          )}
          {info.images[2] !== undefined && (
            <Image
              src={info.images[1]}
              alt="sample-card"
              className="card-img-other"
              width={140}
              height={140}
            />
          )}
          {info.images[3] !== undefined && (
            <Image
              src={info.images[1]}
              alt="sample-card"
              className="card-img-other"
              width={140}
              height={140}
            />
          )}
        </div>
      </div>

      <div className="detailed-information">
        <h3 className="product-name-detail">{info.title}</h3>
        <p className="product-description-detail">{info.description}</p>
        <div className="flex items-center gap-2 rating">
          <Rating
            value={Math.round(info.rating)}
            readonly
            className="flex rate-bar"
          />
          <Typography color="blue-gray" className="font-medium">
            {info.rating}
          </Typography>
        </div>
        <div className="product-prices">
          <span className="actual-price">
            {sign}{" "}
            {(info.price * dollarsToEuro * rate).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </span>
          <span className="original-price">
            {sign}{" "}
            {(
              info.price * dollarsToEuro * rate +
              (info.price * dollarsToEuro * rate * info.discountPercentage) /
                100
            ).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </span>
          <span className="discount-percentage">
            -{info.discountPercentage}%
          </span>
        </div>
        <div className="more-detail">
          <p>In stock: {info.stock}</p>
          <p>Brand: {info.brand}</p>
          <p>Category: {info.category}</p>
        </div>
        {/*======================================== LOG IN USER INTERFACE SECTION =================== START */}
        {isMatch === false && session?.user.id && (
          <div className="block-element-detailed" onClick={createItem}>
            <span>Add to Bag</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              style={{
                width: "25px",
                height: "25px",
              }}
              className="cart-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>
        )}
        {/*section is created when merging local cart to no server cart */}
        {items === undefined && myPosts.length !== 0 && (
          <>
            <Link href="/yourcart">
              <p
                style={{
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                CLICK TO VIEW CART
              </p>
            </Link>
          </>
        )}
        {isMatch === true && session?.user.id && items !== undefined && (
          <div className="add-cart-btnV2">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onClick={() => incrementItem(items[indexDB]?._id)}
              >
                <path
                  d="M11.25 19V12.75H5V11.25H11.25V5H12.75V11.25H19V12.75H12.75V19H11.25Z"
                  fill="#0266FF"
                />
              </svg>
              <span className="cart-item-counter">
                {items[indexDB]?.quantity}
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onClick={() => decrementItem(items[indexDB]?._id)}
              >
                <path d="M5 12.75V11.25H19V12.75H5Z" fill="#0266FF" />
              </svg>
              <Link href="/yourcart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M8.51122 19C8.13128 19 7.80737 18.8673 7.53952 18.6018C7.27166 18.3363 7.13774 18.0171 7.13774 17.6443C7.13774 17.2715 7.27302 16.9537 7.54358 16.6909C7.81415 16.428 8.1394 16.2966 8.51934 16.2966C8.89928 16.2966 9.22318 16.4294 9.49104 16.6948C9.75889 16.9603 9.89282 17.2795 9.89282 17.6523C9.89282 18.0251 9.75754 18.3429 9.48698 18.6058C9.21641 18.8686 8.89116 19 8.51122 19ZM16.1642 19C15.7843 19 15.4604 18.8673 15.1925 18.6018C14.9247 18.3363 14.7908 18.0171 14.7908 17.6443C14.7908 17.2715 14.926 16.9537 15.1966 16.6909C15.4672 16.428 15.7924 16.2966 16.1723 16.2966C16.5523 16.2966 16.8762 16.4294 17.1441 16.6948C17.4119 16.9603 17.5458 17.2795 17.5458 17.6523C17.5458 18.0251 17.4106 18.3429 17.14 18.6058C16.8694 18.8686 16.5442 19 16.1642 19ZM7.52039 6.60951L9.62497 10.8899H15.1351L17.5267 6.60951H7.52039ZM6.94641 5.4831H18.2169C18.5098 5.4831 18.7327 5.61452 18.8855 5.87735C19.0383 6.14018 19.0382 6.403 18.8851 6.66583L16.3022 11.2278C16.1619 11.4656 15.9798 11.6564 15.7558 11.8004C15.5318 11.9443 15.2867 12.0163 15.0203 12.0163H9.22318L8.15176 13.9687H17.5458V15.0951H8.32395C7.78824 15.0951 7.4024 14.9199 7.16644 14.5695C6.93047 14.219 6.93366 13.8248 7.176 13.3867L8.40048 11.1715L5.49234 5.12641H4V4H6.23851L6.94641 5.4831Z"
                    fill="#0266FF"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
        {/*======================================== LOG IN USER INTERFACE SECTION =================== END */}
        {/*======================================== NO USER INTERFACE SECTION =================== START */}
        {!session?.user.id && isMatch === false && (
          <div className="block-element-detailed" onClick={createItemTemp}>
            <span>Add to Bag</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              style={{
                width: "25px",
                height: "25px",
              }}
              className="cart-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>
        )}
        {!session?.user.id && isMatch === true && (
          <div className="add-cart-btnV2">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onClick={() => incrementItemTemp()}
              >
                <path
                  d="M11.25 19V12.75H5V11.25H11.25V5H12.75V11.25H19V12.75H12.75V19H11.25Z"
                  fill="#0266FF"
                />
              </svg>
              <span className="cart-item-counter">
                {localdata[indexDB]?.quantity}
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onClick={() => decrementItemTemp()}
              >
                <path d="M5 12.75V11.25H19V12.75H5Z" fill="#0266FF" />
              </svg>
              <Link href="/yourcart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M8.51122 19C8.13128 19 7.80737 18.8673 7.53952 18.6018C7.27166 18.3363 7.13774 18.0171 7.13774 17.6443C7.13774 17.2715 7.27302 16.9537 7.54358 16.6909C7.81415 16.428 8.1394 16.2966 8.51934 16.2966C8.89928 16.2966 9.22318 16.4294 9.49104 16.6948C9.75889 16.9603 9.89282 17.2795 9.89282 17.6523C9.89282 18.0251 9.75754 18.3429 9.48698 18.6058C9.21641 18.8686 8.89116 19 8.51122 19ZM16.1642 19C15.7843 19 15.4604 18.8673 15.1925 18.6018C14.9247 18.3363 14.7908 18.0171 14.7908 17.6443C14.7908 17.2715 14.926 16.9537 15.1966 16.6909C15.4672 16.428 15.7924 16.2966 16.1723 16.2966C16.5523 16.2966 16.8762 16.4294 17.1441 16.6948C17.4119 16.9603 17.5458 17.2795 17.5458 17.6523C17.5458 18.0251 17.4106 18.3429 17.14 18.6058C16.8694 18.8686 16.5442 19 16.1642 19ZM7.52039 6.60951L9.62497 10.8899H15.1351L17.5267 6.60951H7.52039ZM6.94641 5.4831H18.2169C18.5098 5.4831 18.7327 5.61452 18.8855 5.87735C19.0383 6.14018 19.0382 6.403 18.8851 6.66583L16.3022 11.2278C16.1619 11.4656 15.9798 11.6564 15.7558 11.8004C15.5318 11.9443 15.2867 12.0163 15.0203 12.0163H9.22318L8.15176 13.9687H17.5458V15.0951H8.32395C7.78824 15.0951 7.4024 14.9199 7.16644 14.5695C6.93047 14.219 6.93366 13.8248 7.176 13.3867L8.40048 11.1715L5.49234 5.12641H4V4H6.23851L6.94641 5.4831Z"
                    fill="#0266FF"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
        {/*======================================== NO USER INTERFACE SECTION =================== END */}
      </div>
    </div>
  );
}
