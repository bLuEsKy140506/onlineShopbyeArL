import Userorder from "@/models/orderitem";
import { connectToDB } from "@/utils/database";

export const GET = async (request) => {
  try {
    await connectToDB();

    const order = await Userorder.find({}).populate("creator");

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
