"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Image from "next/image";
import "@/app/yourcart/cart_style.css";

const MyConfirmedItems = () => {
  const { data: session } = useSession();
  const { name, rate } = useSelector((state) => state.exchangeValue);
  const [myPosts, setMyPosts] = useState([]);
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

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `https://onlineshopbyearl-bluesky140506.vercel.app/api/userss/${session?.user.id}/orderedconfirm`
      );
      const data = await response.json();
      setMyPosts(data);
    };
    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  sign = symbols[name];
  console.log(myPosts);
  return (
    <div className="cart-container">
      {myPosts?.length === 0 && (
        <div style={{ height: "85vh", textAlign: "center" }}>
          <br />
          <h2>NO PAST ORDER YET</h2>
        </div>
      )}
      {myPosts?.length !== 0 && (
        <>
          <div style={{ textAlign: "center" }}>
            <h2>Here the list of your past orders</h2>
            <h2>First is the latest</h2>
          </div>

          {myPosts
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((items, index) => (
              <div key={`${items.title}-${index}`}>
                <p style={{ backgroundColor: "lightblue" }}>
                  ORDER # {index + 1}
                </p>
                <br />
                <ul className="cart-list-container">
                  {items.items.map((item) => (
                    <li key={`${item._id}`}>
                      <div className="cart-list-items">
                        <div className="switch-view-1">
                          <figure className="cart-thumbnail-container">
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              width={50}
                              height={60}
                            />
                          </figure>
                          <div className="switch-view">
                            <div className="cart-item-title-brand-cat">
                              <p className="cart-item-title"> {item.title}</p>

                              <div className="cart-item-brand-category">
                                <span className="cart-item-brand">
                                  {item.brand}
                                </span>
                                <span className="cart-item-category">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="cart-item-counter">
                                <span
                                  style={{
                                    fontSize: "10px",
                                  }}
                                >
                                  Quantity: {item.quantity}
                                </span>{" "}
                              </span>
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
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default MyConfirmedItems;
