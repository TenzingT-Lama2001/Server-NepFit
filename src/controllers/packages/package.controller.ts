import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import config from "../../config/default";
import Stripe from "stripe";
import { packageServices } from "../../services/package";
const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
type PlanData = {
  id: string;
  amount: number;
  currency: string;
  interval: Stripe.PlanCreateParams.Interval;
  active?: boolean;
  product: {
    name: string;
    description: string;
  };
  interval_count?: number;
};
export async function addPackage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, price, description, duration, durationUnit } = req.body;

    // const planData: PlanData = {
    //   id: name,
    //   amount: price * 100,
    //   currency: "usd",
    //   interval: "month",
    //   product: {
    //     name,
    //     description,
    //   },
    // };
    // if (duration > 1) {
    //   planData.interval_count = duration;
    // }

    // const plan = await stripe.plans.create(planData);
    const packageData = {
      name,
      price,
      description,
      duration,
      durationUnit,
    };
    const data = await packageServices.addPackage({ packageData });
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function getPackages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await packageServices.getPackages({
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      searchQuery: searchQuery as string,
      sortBy: sortBy as string,
      order: order as string,
    });

    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function getOnePackage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await packageServices.getOnePackage(req.params.packageId);
    console.log(req.params.packageId);
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function updatePackage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, price, description, duration, durationId } = req.body;
    // const planData: PlanData = {
    //   id: name,
    //   amount: price * 100,
    //   currency: "usd",
    //   interval: "month",
    //   product: {
    //     name: name,
    //     description: description,
    //   },
    // };
    // if (duration > 1) {
    //   planData.interval_count = duration;
    // }

    // const plan = await stripe.plans.create(planData);
    const packageData = {
      name,
      price,
      description,
      duration,
      durationId,
    };
    await packageServices.updatePackage({
      packageData,
      packageId: req.params.packageId,
    });

    res.status(200).json({
      message: lang.en.UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function deletePackage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await packageServices.deletePackage(req.params.packageId);
    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
