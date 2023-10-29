"use client";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { signIn, useSession, getProviders } from "next-auth/react";
import { Rating, Typography } from "@material-tailwind/react";
export { Rating, Typography };
import "../app/detailedPage/DetailedPage.css";
import "./Products.css";

export default function Products({ info, items, onUpdateCartItem, objId }) {
  //VARIABLE SECTION ---------------------------------------------------------------------------------------------------------------
  const {
    id,
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    images,
  } = info;

  const router = useRouter();
  const { data: session } = useSession();

  const [isMatch, setIsMatch] = useState(false);
  const [indexDB, setIndexDB] = useState(0);
  const { name, rate } = useSelector((state) => state.exchangeValue);
  const { counter } = useSelector((state) => state.cartItem);
  const [localdata, setLocalData] = useState([]);

  let dollarsToEuro = 1 / 1.057861;
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
  const [providers, setProviders] = useState(null);

  //USE EFFECT SECTION -----------------------------------------------------------------------------------------------------
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
      setIsMatch(isMatchtemp);
      setLocalData(temp);
      setIndexDB(index);
    }
  }, [session?.user.id, info.title]);

  useEffect(() => {
    if (session?.user.id && items !== undefined) {
      if (items?.some((item) => item.title === info.title)) {
        setIsMatch(true);
        const index = items.findIndex((item) => item.title === info.title);
        setIndexDB(index);
      }
    }
  }, [counter, session?.user.id, info.title, items]);

  //LOG IN USER FUNCTION SECTION -------------------------------------------------------------------------------------------------
  // INCREMENT
  const incrementItem = async () => {
    if (items.some((item) => item.title === info.title)) {
      const index = items.findIndex((item) => item.title === info.title);

      let myCartClone = [...items];

      myCartClone[index] = {
        ...myCartClone[index],
        quantity: myCartClone[index].quantity + 1,
      };

      try {
        const response = await fetch(
          `https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/${objId}`,
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
          onUpdateCartItem();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // DECREMENT
  const decrementItem = async () => {
    if (items.some((item) => item.title === info.title)) {
      const index = items.findIndex((item) => item.title === info.title);
      let isPresence;
      let myCartClone = [...items];

      myCartClone[index] = {
        ...items[index],
        quantity: myCartClone[index].quantity - 1,
      };

      if (myCartClone[index].quantity === 0) {
        myCartClone.splice(indexDB, 1);
      }

      if (myCartClone.length === 0) {
        try {
          const response = await fetch(
            `https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/${objId}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            setIsMatch(false);
            onUpdateCartItem("delete");
            router.push("/");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        isPresence = myCartClone.some((item) => item.title === info.title);

        try {
          const response = await fetch(
            `https://onlineshopbyearl-bluesky140506.vercel.app/api/cart/${objId}`,
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

          if (response.ok && isPresence === false) {
            onUpdateCartItem();
            setIsMatch(false);
          }
          if (response.ok && isPresence === true) {
            onUpdateCartItem();
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  sign = symbols[name];

  return (
    <div className="card" key={`id-group`}>
      <Link href={`/products/${id}`}>
        <Image
          src={images[0]}
          alt="sample-card"
          className="card-img"
          width={320}
          height={190}
        />
      </Link>

      <div className="card-info">
        <Link href={`/products/${id}`}>
          <div className="product-info">
            <h3 className="product-name">{title}</h3>

            <p className="product-description">{description}</p>
            <div className="product-prices">
              <span className="actual-price">
                {sign}{" "}
                {(price * dollarsToEuro * rate).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
              <span className="original-price">
                {sign}{" "}
                {(
                  price * dollarsToEuro * rate +
                  (price * dollarsToEuro * rate * discountPercentage) / 100
                ).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
              <span className="discount-percentage">
                -{discountPercentage}%
              </span>
            </div>
          </div>
        </Link>

        <div className="product-ratings">
          <div className="flex items-center gap-2">
            <Rating
              value={Math.round(rating)}
              readonly
              className="flex rate-bar"
            />
            <Typography color="blue-gray" className="font-medium">
              {rating}
            </Typography>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
              />
            </svg>
            <span className="sale-count">{stock}</span>
          </div>
          {/*==== LOG IN USER INTERFACE SECTION --------------------------------------------------------------------------- */}
          {isMatch === false && session?.user.id && (
            <Link href={`/products/${id}`}>
              <div className="block-element ">
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
            </Link>
          )}

          {isMatch === true && session?.user.id && items !== undefined && (
            <div className="add-cart-btnV3">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  onClick={incrementItem}
                >
                  <path
                    d="M11.25 19V12.75H5V11.25H11.25V5H12.75V11.25H19V12.75H12.75V19H11.25Z"
                    fill="#0266FF"
                  />
                </svg>
                <span className="cart-item-counter-product">
                  {items[indexDB]?.quantity}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  onClick={decrementItem}
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
          {/*==== NO USER INTERFACE SECTION --------------------------------------------------------------------------- */}
          <>
            {providers &&
              !session?.user.id &&
              isMatch === false &&
              Object.values(providers).map((provider) => (
                <div className="block-element" key={provider.name}>
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
                    onClick={() => {
                      signIn(provider.id);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </div>
              ))}
          </>
          {localdata?.length !== 0 && isMatch === true && !session?.user.id && (
            <div className="add-cart-btnV3">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  onClick={() => {
                    alert("You must sign-in to use this feature");
                  }}
                >
                  <path
                    d="M11.25 19V12.75H5V11.25H11.25V5H12.75V11.25H19V12.75H12.75V19H11.25Z"
                    fill="#0266FF"
                  />
                </svg>
                <span className="cart-item-counter-product">
                  {localdata[indexDB]?.quantity}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  onClick={() => {
                    alert("You must sign-in to use this feature");
                  }}
                >
                  <path d="M5 12.75V11.25H19V12.75H5Z" fill="#0266FF" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  onClick={() => {
                    alert("You must sign-in to use this feature");
                  }}
                >
                  <path
                    d="M8.51122 19C8.13128 19 7.80737 18.8673 7.53952 18.6018C7.27166 18.3363 7.13774 18.0171 7.13774 17.6443C7.13774 17.2715 7.27302 16.9537 7.54358 16.6909C7.81415 16.428 8.1394 16.2966 8.51934 16.2966C8.89928 16.2966 9.22318 16.4294 9.49104 16.6948C9.75889 16.9603 9.89282 17.2795 9.89282 17.6523C9.89282 18.0251 9.75754 18.3429 9.48698 18.6058C9.21641 18.8686 8.89116 19 8.51122 19ZM16.1642 19C15.7843 19 15.4604 18.8673 15.1925 18.6018C14.9247 18.3363 14.7908 18.0171 14.7908 17.6443C14.7908 17.2715 14.926 16.9537 15.1966 16.6909C15.4672 16.428 15.7924 16.2966 16.1723 16.2966C16.5523 16.2966 16.8762 16.4294 17.1441 16.6948C17.4119 16.9603 17.5458 17.2795 17.5458 17.6523C17.5458 18.0251 17.4106 18.3429 17.14 18.6058C16.8694 18.8686 16.5442 19 16.1642 19ZM7.52039 6.60951L9.62497 10.8899H15.1351L17.5267 6.60951H7.52039ZM6.94641 5.4831H18.2169C18.5098 5.4831 18.7327 5.61452 18.8855 5.87735C19.0383 6.14018 19.0382 6.403 18.8851 6.66583L16.3022 11.2278C16.1619 11.4656 15.9798 11.6564 15.7558 11.8004C15.5318 11.9443 15.2867 12.0163 15.0203 12.0163H9.22318L8.15176 13.9687H17.5458V15.0951H8.32395C7.78824 15.0951 7.4024 14.9199 7.16644 14.5695C6.93047 14.219 6.93366 13.8248 7.176 13.3867L8.40048 11.1715L5.49234 5.12641H4V4H6.23851L6.94641 5.4831Z"
                    fill="#0266FF"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
