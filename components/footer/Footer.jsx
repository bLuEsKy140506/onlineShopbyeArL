import "./Footer.css";
import Image from "next/image";
import logolinkin from "./icon_in.svg";
import logoInstra from "./icon_insta.svg";
import logoFb from "./icon_fb.svg";
import logoTwitter from "./icon_twitter.svg";
import logowhatsup from "./icon_whatsup.svg";
import logotiktok from "./icon_tiktok.svg";
import logoYoutube from "./icon_youtube.svg";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="flex-row links-others">
          <div className="flex-column socials-links">
            <h4>Follow Us</h4>
            <ul className="flex-row socialmedia-list">
              <li className="sm-icon-1">
                <a href="#">
                  <Image src={logolinkin} alt="icon-linkin" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Image src={logoInstra} alt="icon-instragam" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Image src={logoFb} alt="icon-facebook" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Image src={logoTwitter} alt="icon-twitter" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Image src={logowhatsup} alt="icon-whatsup" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Image src={logotiktok} alt="icon-tiktok" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Image src={logoYoutube} alt="icon-youtube" />
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-row legal">
            <span>&copy;BestBuyCorporation 2023</span>
            <span>·</span>
            <span>Privacy</span>
            <span>·</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>
    </>
  );
}
