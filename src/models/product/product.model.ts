import mongoose from "mongoose";
export interface IProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: {
    id: string;
    secure_url: string;
  };
  category: string;
  unit: string;
}

export interface ProductDocument extends IProduct, mongoose.Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: {
    id: string;
    secure_url: string;
  };
  category: string;
  unit: string;
}

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the product name"],
    maxlength: [50, "Name should be under 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
    maxlength: [300, "Description should be under 300 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide the product price"],
  },
  quantity: {
    type: Number,
    required: [true, "Please provide the product quantity"],
  },
  imageUrl: {
    id: {
      type: String,
      // required: [true, "Image ID is required"],
    },
    secure_url: {
      type: String,
      // required: [true, "Image secure url is required"],
    },
  },
  category: {
    type: String,
    required: [true, "Please provide product category"],
    maxlength: [30, "Category should be under 30 characters"],
  },
  unit: {
    type: String,
  },
});

const Product = mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;
