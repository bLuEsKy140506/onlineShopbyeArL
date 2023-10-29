import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      id: Number,
      title: String,
      description: String,
      price: Number,
      quantity: Number,
      discountPercentage: Number,
      thumbnail: String,
      rating: Number,
      stock: Number,
      brand: String,
      category: String,
      images: [String],
    },
  ],
  currency: {
    name: String,
    rate: Number,
  },
  timestamp: Number,
});

const Userorder = models.UserOrder || model("UserOrder", OrderSchema);

export default Userorder;
