import Userorder from "@/models/orderitem";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const cart = await Userorder.find({ creator: params.id }).populate(
      "creator"
    );

    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts created by user", {
      status: 500,
    });
  }
};
