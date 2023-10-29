import DetailedPage from "@/app/detailedPage/DetailedPage";

export default async function Product({ params }) {
  const info = await getData(params.product);

  return (
    <div>
      <DetailedPage info={info} />
    </div>
  );
}

async function getData(id) {
  const res = await fetch(`http://dummyjson.com/products/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
