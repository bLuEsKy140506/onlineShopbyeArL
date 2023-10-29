import UserCart from "@/models/cartitem";
import { connectToDB } from "@/utils/database";

export const GET = async (request) => {
  try {
    await connectToDB();

    const cart = await UserCart.find({}).populate("creator");

    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  const { items } = await request.json();
  console.log(params.id, items);
  try {
    await connectToDB();
    console.log(params.id);
    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    // Update the prompt with new data
    existingPrompt.items = items;

    await existingPrompt.save();

    return new Response("Successfully updated the Prompts", { status: 200 });
  } catch (error) {
    return new Response("Error Updating Prompt", { status: 500 });
  }
};
