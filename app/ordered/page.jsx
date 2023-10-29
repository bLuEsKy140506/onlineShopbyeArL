"use client";

import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import "./ordered_style.css";
import imgPacked from "./Image-packed.svg";

const MyOrdered = () => {
  const items = useSelector((state) => state.cartArrayConfirm);

  return (
    <div className="ordered-container">
      {items?.length === 0 && (
        <div>
          <Link href="/orderedconfirm">
            <button
              className="continue-shopping-btn"
              style={{ margin: "20px 0px" }}
            >
              It&apos;s already in the confirmed page
            </button>
          </Link>
        </div>
      )}
      {items?.length !== 0 && (
        <>
          <div className="ordered-flex-items">
            <h2 className="ordered-header">The order is placed</h2>

            <div>
              <p className="ordered-description">
                Thank you for ordering. We will ship it in 1–2 days and send you
                a follow-up email to track the delivery.
              </p>
            </div>

            <ul className="ordered-list-container">
              {items?.length !== 0 &&
                items?.map((item, index) => (
                  <li key={`${item.title}`}>
                    <div className="ordered-list-items">
                      <figure className="cart-thumbnail-container">
                        <Image
                          src={item.thumbnail}
                          alt={`${item.title}${index}`}
                          width={140}
                          height={100}
                        />
                      </figure>
                      <div className="cart-item-title-brand-cat">
                        <p className="ordered-item-title"> {item.title}</p>

                        <div className="ordered-item-brand-category">
                          <span className="ordered-item-brand">
                            {item.quantity}{" "}
                            {item.quantity === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <figure className="img-ordered">
            <Image src={imgPacked} alt="delivery-image" />
          </figure>
        </>
      )}

      <Link href="/">
        <button
          className="continue-shopping-btn"
          style={{ marginBottom: "30px" }}
        >
          Continue shopping
        </button>
      </Link>
    </div>
  );
};

export default MyOrdered;
