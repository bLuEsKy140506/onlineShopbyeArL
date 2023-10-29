import "./navBar.css";

import Image from "next/image";
import logo from "./zLogo.png";
import Nav from "./zNav";
import Link from "next/link";

import InitiatorPathAndExchangeRate from "../initiators/InitiatorPathAndExRate";
import CartCounterDisplay from "./zCartCounterDisplay";

export default function NavBar() {
  return (
    <>
      <div className="header-container">
        <div className="header">
          <Link href="/" className="logo-section">
            <Image src={logo} alt="company-logo" width={140} height={24} />
          </Link>

          <div className="login-and-cart-currency">
            <Nav />
            <CartCounterDisplay color="white" />
          </div>
          <InitiatorPathAndExchangeRate />
        </div>
        <div className="login-and-cart-currency-mobile">
          <CartCounterDisplay color="blue" />
          <Nav color="" />
        </div>
      </div>
    </>
  );
}
