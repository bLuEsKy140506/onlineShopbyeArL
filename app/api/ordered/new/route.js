import Userorder from "@/models/orderitem";
import { connectToDB } from "@/utils/database";

export const POST = async (request) => {
  const { userId, items, currency, timestamp } = await request.json();

  try {
    await connectToDB();
    const neworder = new Userorder({
      creator: userId,
      items,
      currency,
      timestamp: timestamp,
    });

    await neworder.save();
    return new Response(JSON.stringify(neworder), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
