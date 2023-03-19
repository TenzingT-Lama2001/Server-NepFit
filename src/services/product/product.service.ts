import Product, { ProductDocument } from "../../models/product/product.model";
import { v2 as cloudinary } from "cloudinary";
import { SortOrder } from "mongoose";
type CreateProduct = {
  productData: Partial<ProductDocument>;
  image?: string;
};
export async function addProduct({ productData, image }: CreateProduct) {
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "product-image",
    });

    const { public_id, secure_url } = response;
    const productImage = {
      id: public_id,
      secure_url,
    };

    const productDataWithImage = { ...productData, imageUrl: productImage };
    await Product.create(productDataWithImage);
  } else {
    await Product.create(productData);
  }
}

export type GetProducts = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
  sortBy: string;
  order: string;
};

export async function getProducts({
  pageNumber,
  pageSize,
  searchQuery,
  sortBy,
  order,
}: GetProducts) {
  const regex = new RegExp(searchQuery, "i");
  const pageNumberPositive = Math.max(pageNumber + 1, 1);
  const query = Product.find({
    $or: [{ name: regex }, { description: regex }],
  })
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const products = await query;
  const totalProducts = await Product.countDocuments({
    $or: [{ name: regex }, { description: regex }],
  });
  return {
    products,
    totalProducts,
  };
}

export async function getOneProduct(id: string) {
  const product = await Product.findById(id);
  return product;
}

type UpdateProduct = {
  productData: Partial<ProductDocument>;
  productId: string;
  image: string;
};
export async function updateProduct({
  productData,
  productId,
  image,
}: UpdateProduct) {
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "product-profile",
    });

    const { public_id, secure_url } = response;
    const productImage = {
      id: public_id,
      secure_url,
    };
    const productDataWithImage = { ...productData, imageUrl: productImage };
    await Product.findByIdAndUpdate(productId, productDataWithImage, {
      new: true,
      runValidators: true,
    });
  } else {
    await Product.findByIdAndUpdate(productId, productData, {
      new: true,
      runValidators: true,
    });
  }
}
export async function deleteProduct(productId: string) {
  await Product.findByIdAndDelete(productId);
}
