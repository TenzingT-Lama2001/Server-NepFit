import Product, { ProductDocument } from "../../models/product/product.model";
import { v2 as cloudinary } from "cloudinary";
import { SortOrder } from "mongoose";
import {
  createPrice,
  createProduct,
} from "../../controllers/stripe/stripe.controller";
type CreateProduct = {
  productData: Partial<ProductDocument>;
  image?: string;
};
export async function addProduct({ productData, image }: CreateProduct) {
  const { name, price, description, quantity, category, unit } = productData;
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "product-image",
    });

    const currency = "usd";
    const metadata = {
      price,
      currency,
    };

    const product = await createProduct(name, description, metadata);
    console.log(product);
    const productId = product.id;
    console.log(productId);

    const priceObject = await createPrice(price, currency, productId);
    const { public_id, secure_url } = response;
    const productImage = {
      id: public_id,
      secure_url,
    };
    const newData = {
      name,
      description,
      price,
      quantity,
      category,
      unit,
      stripeProductId: productId,
      stripeProductPriceId: priceObject.id,
    };
    console.log({ newData });
    const productDataWithImage = { ...newData, imageUrl: productImage };
    console.log({ productDataWithImage });
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
    const { name, price, description, quantity, category, unit } = productData;

    if (price) {
      const currency = "usd";
      const metadata = {
        price,
        currency: "usd",
      };
      const product = await createProduct(name, description, metadata);
      const productId = product.id;

      const priceObject = await createPrice(price, currency, productId);
      const response = await cloudinary.uploader.upload(image, {
        folder: "product-profile",
      });

      const newData = {
        name,
        description,
        price,
        quantity,
        category,
        unit,
        stripeProductId: productId,
        stripeProductPriceId: priceObject.id,
      };
      const { public_id, secure_url } = response;
      const productImage = {
        id: public_id,
        secure_url,
      };
      const productDataWithImage = { ...newData, imageUrl: productImage };
      await Product.findByIdAndUpdate(productId, productDataWithImage, {
        new: true,
        runValidators: true,
      });
    } else {
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
    }
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
