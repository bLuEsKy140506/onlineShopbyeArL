import UserCart from "@/models/cartitem";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const cart = await UserCart.findById(params.id).populate("creator");
    if (!cart) return new Response("Cart Not Found", { status: 404 });

    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
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

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the prompt by ID and remove it
    await UserCart.findByIdAndRemove(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting prompt", { status: 500 });
  }
};

export async function PUT(request, { params }) {
  const { id } = params;
  const {
    creator: creator,
    items: items,
    currency: currency,
  } = await request.json();
  // console.log(id, creator, items, currency);
  await connectToDB();
  await UserCart.findByIdAndUpdate(id, { creator, items, currency });

  return new Response("updated successfully", { status: 200 });
}
