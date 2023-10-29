"use client";
import "@/styles/globals.css";

import Provider from "@/components/Provider";
import NavBar from "@/components/navBar/navBar";
import { ReduxProvider } from "@/redux/provider";
import Footer from "@/components/footer/Footer";

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <Provider>
        <ReduxProvider>
          <NavBar />
          <main>{children}</main>
        </ReduxProvider>
      </Provider>

      <Footer />
    </body>
  </html>
);

export default RootLayout;
