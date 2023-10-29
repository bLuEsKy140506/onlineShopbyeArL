"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import CartCounterDisplay from "./zCartCounterDisplay";
import { fetchCartArray } from "@/redux/features/userCartArraySlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const Nav = ({ color }) => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  return (
    <nav>
      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex flex-row-reverse gap-3 md:gap-5 reverse align-center">
            <button
              type="button"
              onClick={() => {
                signOut();
              }}
              className="sign-out-btn"
            >
              Sign Out
            </button>

            <Link href="/orderedconfirm">
              <Image
                src={session?.user.image}
                width={37}
                height={37}
                className="rounded-full img-profile"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className="black_btn"
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
      {/* <CartCounterDisplay /> */}
      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/orderedconfirm"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Confirmed Order
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="mt-5 w-full black_btn"
                  style={{
                    color: "blue",
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className="black_btn"
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
