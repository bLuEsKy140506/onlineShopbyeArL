import UserCart from "@/models/cartitem";
import { connectToDB } from "@/utils/database";

export const POST = async (request) => {
  const { userId, items, currency } = await request.json();

  try {
    await connectToDB();
    const newCart = new UserCart({ creator: userId, items, currency });

    await newCart.save();
    console.log("weeee");
    return new Response(JSON.stringify(newCart), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
