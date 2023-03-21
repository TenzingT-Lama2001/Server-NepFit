import { NextFunction, Request, Response } from "express";
import config from "../../config/default";
import Stripe from "stripe";
import { PaymentIntent } from "@stripe/stripe-js";
import { ProductDocument } from "../../models/product/product.model";
import { PackageDocument } from "../../models/package/package.model";
import Member from "../../models/member/member.model";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// export async function createCustomer(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const { email } = req.body;
//     const customer = await stripe.customers.create({
//       email,
//     });
//     res.cookie("stripe_customer", customer.id, {
//       maxAge: 900000,
//       httpOnly: true,
//     });
//     res.send({ customer: customer });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function createProduct(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const { name, description, price, currency } = req.body;
//     const product = await stripe.products.create({
//       name: name,
//       description: description,
//       metadata: {
//         price: price,
//         currency: currency,
//       },
//     });
//     res.send({ product: product });
//   } catch (error) {
//     next(error);
//   }
// }
// export async function createPrice(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const { product, price, currency } = req.body;
//     const priceObject = await stripe.prices.create({
//       unit_amount: price,
//       currency: currency,
//       product: product,
//       recurring: { interval: "month" },
//     });
//     res.send({ price: priceObject });
//   } catch (error) {
//     next(error);
//   }
// }
// export async function createSubscription(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     // Simulate authenticated user. In practice this will be the
//     // Stripe Customer ID related to the authenticated user.
//     const customerId = req.cookies["stripe_customer"];

//     const priceId = req.body.priceId;

//     const subscription = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [
//         {
//           price: priceId,
//         },
//       ],
//       payment_behavior: "default_incomplete",
//       expand: ["latest_invoice.payment_intent"],
//     });

//     const latestInvoiceId = subscription.latest_invoice as string;
//     const latestInvoice = await stripe.invoices.retrieve(latestInvoiceId, {
//       expand: ["payment_intent"],
//     });

//     const paymentIntent = latestInvoice.payment_intent;
//     if (!paymentIntent || typeof paymentIntent !== "object") {
//       throw new Error("No payment intent found for this invoice.");
//     }

//     res.send({
//       subscriptionId: subscription.id,
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function cancelSubscription(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const deletedSubscription = await stripe.subscriptions.del(
//       req.body.subscriptionId
//     );
//     res.send({ subscription: deletedSubscription });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function createSubscription(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     // Simulate authenticated user. In practice this will be the
//     // Stripe Customer ID related to the authenticated user.
//     const customerId = req.cookies["stripe_customer"];

//     //Getting the product details
//     const product = req.body.product;

//     //Creating the prices
//     const price = await stripe.prices.create({
//       product_data: {
//         name: product?.name,
//       },
//       unit_amount: product.price,
//       currency: product.currency,
//       recurring: { interval: "month" },
//     });

//     const subscription = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [
//         {
//           price: price.id,
//         },
//       ],
//       payment_behavior: "default_incomplete",
//       expand: ["latest_invoice.payment_intent"],
//     });
//     res.send({
//       subscriptionId: subscription.id,
//       clientSecret: subscription.latest_invoice,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

export async function createProduct(
  name: string,
  description: string,
  metadata: any
) {
  const product = await stripe.products.create({
    name,
    description,
    metadata,
  });
  return product;
}

// Function to create a price
export async function createPrice(
  unitAmount: number,
  currency: string,
  productId: string,
  interval_count: number
) {
  const priceObject = await stripe.prices.create({
    unit_amount: unitAmount * 100,
    currency: currency,
    product: productId,
    recurring: { interval: "month", interval_count },
  });
  return priceObject;
}

// export async function createCustomer(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const { email } = req.body;
//     console.log("req.body", req.body);
//     const customer = await stripe.customers.create({
//       email,
//     });

//     const member = await Member.findOne({ email }).exec();

//     if (!member) {
//       return res.status(404).send({ error: "Member not found" });
//     }

//     member.stripeCustomerId = customer.id;
//     await member.save();

//     res.cookie("stripe_customer", customer.id, {
//       maxAge: 900000,
//       httpOnly: true,
//     });
//     res.send({ customer: customer });
//   } catch (error) {
//     next(error);
//   }
// }
export async function getInvoiceList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const customerId = req.cookies["stripe_customer"];
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit: 10, // optional: limit the number of results to 10
  });
  res.send({ invoices });
}
export async function createSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Simulate authenticated user. In practice this will be the
    // Stripe Customer ID related to the authenticated user.
    const customerId = req.cookies["stripe_customer"];

    const priceId = req.body.priceId;
    // const planId = req.body.planId;
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      cancel_at_period_end: true,
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    console.log("Subscription", subscription);

    const latest_invoice = subscription.latest_invoice as Stripe.Invoice;
    if (latest_invoice.payment_intent) {
      const intent = latest_invoice.payment_intent as Stripe.PaymentIntent;
      res.send({
        subscriptionId: subscription.id,
        clientSecret: intent.client_secret,
      });
    }
  } catch (error) {
    next(error);
  }
}
// export async function createInvoicePreview(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     console.log("req.query", req.query);
//     const { customerId, subscriptionId } = req.query;

//     const invoicePreview = await stripe.invoices.retrieveUpcoming({
//       customer: customerId,
//     });

//     res.send({ invoicePreview });
//   } catch (error) {
//     next(error);
//   }
// }
