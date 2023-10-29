/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+++++++++++ STARTING POINT +++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import AllCard from "@/components/all-cards/All-cards";

import "@/components/components.css";

export default async function Home() {
  const data = await getData();

  return (
    <>
      <main className="main-page">
        <AllCard data={data.products} />
      </main>
    </>
  );
}
//fetch('https://dummyjson.com/products?limit=0')
async function getData() {
  const res = await fetch("https://dummyjson.com/products?limit=0");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

//http://data.fixer.io/api/latest?access_key=705ba7415f31dde1c5a4e82c1bc453e9&symbols=USD,AUD,CAD,PLN,MXN,PHP&format=1
