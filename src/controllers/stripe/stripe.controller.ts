import { NextFunction, Request, Response } from "express";
import config from "../../config/default";
import Stripe from "stripe";
import { PaymentIntent } from "@stripe/stripe-js";
import { ProductDocument } from "../../models/product/product.model";
import Package, { PackageDocument } from "../../models/package/package.model";
import Member from "../../models/member/member.model";
import Membership from "../../models/membership/membership.model";
import Order from "../../models/order/order.model";
import logger from "../../utils/logger";

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
  interval_count?: number
) {
  if (interval_count) {
    const priceObject = await stripe.prices.create({
      unit_amount: unitAmount * 100,
      currency: currency,
      product: productId,
      recurring: { interval: "month", interval_count },
    });
    return priceObject;
  } else {
    const priceObject = await stripe.prices.create({
      unit_amount: unitAmount * 100,
      currency: currency,
      product: productId,
    });
    return priceObject;
  }
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
  try {
    const customerId = req.cookies["stripe_customer"];
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 10, // optional: limit the number of results to 10
    });
    res.send({ invoices });
  } catch (err) {
    next(err);
  }
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
    const programId = req.body.programId;
    const priceId = req.body.priceId;
    const trainerId = req.body.trainerId;
    // const planId = req.body.planId;
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      metadata: {
        programId: programId,
        trainerId: trainerId,
      },
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
//
interface StripeInvoice {
  id: string;
  object: string;
  lines: {
    object: string;
    data: any[]; // You can replace `any` with the actual type of the `data` property.
    has_more: boolean;
    total_count: number;
    url: string;
  };
  // Other properties
}
export async function webhooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const endpointSecret =
      "whsec_72685f40ab61e9b62c3abc0afc06d53c7a261ea817bfaaecc4105b2c14b361b2";
    const sig = req.headers["stripe-signature"];

    const stripeSignature = req.headers["stripe-signature"];

    const stripePayload = req.body;

    let event = stripe.webhooks.constructEvent(
      stripePayload,
      stripeSignature,
      endpointSecret
    );

    // Check if the 'event' variable is defined before accessing its properties
    if (!event) {
      throw new Error("Event is not defined");
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
        const customerSubscriptionCreated = event.data.object;
        // console.log({ customerSubscriptionCreated });
        // Then define and call a function to handle the event customer.subscription.created
        break;
      case "customer.subscription.deleted":
        const customerSubscriptionDeleted = event.data.object;
        // console.log({ customerSubscriptionDeleted });
        // Then define and call a function to handle the event customer.subscription.created
        break;
      case "invoice.payment_failed":
        const invoicePaymentFailed = event.data.object;
        // console.log({ invoicePaymentFailed });
        break;
      case "invoice.payment_succeeded":
        const invoicePaymentSucceeded: any = event.data.object;
        // const startDate = invoicePaymentSucceeded.lines.data.period.start;
        // const endDate = invoicePaymentSucceeded.lines.data.period.end;
        // console.log({ startDate, endDate });
        console.log(
          "invoicePaymentSucceeded.lines.data[0]",
          invoicePaymentSucceeded.lines.data[0]
        );
        console.log(
          "invoicePaymentSucceeded.lines.data[0].period)",
          invoicePaymentSucceeded.lines.data[0].period
        );
        console.log(
          "invoicePaymentSucceeded.lines.data[0].period.start",
          invoicePaymentSucceeded.lines.data[0].period.start
        );
        console.log("invoicesuccededdata", invoicePaymentSucceeded);
        const startDate = invoicePaymentSucceeded.lines.data[0].period.start;
        const endDate = invoicePaymentSucceeded.lines.data[0].period.end;
        const customerEmail = invoicePaymentSucceeded.customer_email;
        const stripePackagePriceId =
          invoicePaymentSucceeded.lines.data[0].plan.id;

        const subscriptionId = invoicePaymentSucceeded.subscription;
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const programId = subscription.metadata.programId;
        const trainerId = subscription.metadata.trainerId;
        console.log("metadata", subscription.metadata);
        console.log({ programId, trainerId });
        const membership = await createMembership({
          startDate,
          endDate,
          customerEmail,
          stripePackagePriceId,
          programId,
          trainerId,
        });
        res.send({ membership });
        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log({ paymentIntentSucceeded });
        break;
      case "payment_intent.payment_failed":
        const paymentIntentFailed = event.data.object;
        console.log({ paymentIntentFailed });
        break;
      case "payment_intent.requires_action":
        const paymentIntentRequiresAction = event.data.object;
        // console.log({ paymentIntentRequiresAction });
        // Then define and call a function to handle the event payment_intent.requires_action
        break;
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        const {
          amount,
          billing_details: { address },
          metadata,
        } = chargeSucceeded as Stripe.Charge;
        type Product = {
          qty: string;
          stripeProductId: string;
          name: string;
          amount: string;
          [key: string]: any;
        };

        const products: Product[] = [];

        Object.keys(metadata).forEach((key: string) => {
          if (key.startsWith("product_")) {
            const parts = key.split("_");
            const index = parseInt(parts[1], 10);
            const field = parts[2];
            const value = metadata[key];
            if (!products[index]) {
              products[index] = {
                qty: "",
                stripeProductId: "",
                name: "",
                amount: "",
              };
            }
            products[index][field] = value;
          }
        });
        const { memberId } = metadata;

        console.log({ address });
        console.log({ products });
        logger.info(products);
        const { city } = address;
        const orderData = {
          memberId,
          shippingAddress: city,
          products,
          amount,
        };
        const order = await Order.create(orderData);
        console.log({ order });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

type CreateMembership = {
  startDate: number;
  endDate: number;
  customerEmail: string;
  stripePackagePriceId: string;
  programId: string;
  trainerId: string;
};
export async function createMembership({
  startDate,
  endDate,
  customerEmail,
  stripePackagePriceId,
  programId,
  trainerId,
}: CreateMembership) {
  try {
    console.log("FROM CREATEMEMBERSHIP");
    console.log({
      startDate,
      endDate,
      customerEmail,
      stripePackagePriceId,
      programId,
      trainerId,
    });

    //convert date to HRD human readable date
    //converting from Unix Timestamp
    const startDateHRD = new Date(startDate * 1000);
    const endDateHRD = new Date(endDate * 1000);

    //get memberId from customerId
    const email = customerEmail;
    const member = await Member.findOne({ email });

    //get packageId from stripePackagePriceId

    const packages = await Package.findOne({ stripePackagePriceId });

    const membershipData = {
      member: member._id,
      program: programId,
      packages: packages._id,
      startDate: startDateHRD,
      endDate: endDateHRD,
      trainer: trainerId,
    };

    const newMembership = await Membership.create(membershipData);
    await newMembership.save();

    member.status = "Active";
    await member.save();
    console.log({ newMembership });
  } catch (error) {
    console.log(error);
  }
}

// export async function createPaymentIntent(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   console.log("req", req);
//   const { amount, stripeProductIdArray, stripeProductPriceIdArray,stripeProductQty } = req.query;
//   console.log(req.query);
//   const customerId = req.cookies["stripe_customer"];

//   const amountNumber: number = Number(amount);
//   try {
//     const paymentIntent: Stripe.PaymentIntent =
//       await stripe.paymentIntents.create({
//         amount: amountNumber * 100,
//         currency: "usd",
//         automatic_payment_methods: {
//           enabled: true,
//         },
//         metadata: {
//           customerId,
//         },
//       });
//     console.log("client secret", paymentIntent.client_secret);
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function createPaymentIntent(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { stripeProductIdArray, stripeProductQty } = req.query as any;
//   const customerId = req.cookies["stripe_customer"];

//   try {
//     const paymentIntents = await Promise.all(
//       stripeProductIdArray.map((stripeProductId: string, index: number) => {
//         const { qty, subtotal } = stripeProductQty[index];
//         return stripe.paymentIntents.create({
//           amount: Number(subtotal),
//           currency: "usd",
//           automatic_payment_methods: {
//             enabled: true,
//           },
//           metadata: {
//             customerId,
//             stripeProductId,
//             qty,
//             subtotal,
//           },
//         });
//       })
//     );

//     res.send({
//       clientSecrets: paymentIntents.map(
//         (paymentIntent) => paymentIntent.client_secret
//       ),
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
export async function createPaymentIntent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { stripeProductQty, amount, memberId } = req.query as any;
  const customerId = req.cookies["stripe_customer"];

  try {
    const metadata = {} as any;

    stripeProductQty.forEach((productQty: any, index: number) => {
      const { stripeProductId, qty, subtotal, name } = productQty;
      metadata[`product_${index}_stripeProductId`] = stripeProductId;
      metadata[`product_${index}_qty`] = qty;
      metadata[`product_${index}_amount`] = subtotal;
      metadata[`product_${index}_name`] = name;
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        memberId,
      },
    });
    // console.log({ paymentIntent });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
  }
}

/*

const metadata = {
  product_0_qty: '2',
  product_0_stripeProductId: 'prod_NfAqhYG9nH8HS1',
  product_1_qty: '3',
  product_1_stripeProductId: 'prod_JKAqhYG9nHFHJS1',
};

const products = [];

Object.keys(metadata).forEach(key => {
  if (key.startsWith('product_')) {
    const parts = key.split('_');
    const index = parts[1];
    const field = parts[2];
    const value = metadata[key];
    if (!products[index]) {
      products[index] = {};
    }
    products[index][field] = value;
  }
});

console.log(products); // Output: [ { qty: '2', stripeProductId: 'prod_NfAqhYG9nH8HS1' }, { qty: '3', stripeProductId: 'prod_JKAqhYG9nHFHJS1' } ]
s

*/
