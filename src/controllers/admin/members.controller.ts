import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import { adminMembersServices } from "../../services/admin";
import config from "../../config/default";
import Stripe from "stripe";
import { GetMembers } from "../../services/admin/members.service";
const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
export async function getMembers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.query);
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await adminMembersServices.getMembers({
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

export async function getOneMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await adminMembersServices.getOneMember(req.params.memberId);

    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { firstName, lastName, email, password, address, phoneNumber, role } =
      req.body;
    const { image } = req.body;

    const memberData = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      role,
    };
    await adminMembersServices.updateMember({
      memberData,
      memberId: req.params.memberId,
      image,
    });

    res.status(200).json({
      message: lang.en.UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function createMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log({ req });
    console.log("createMember req body", req.body);
    const { firstName, lastName, email, password, address, phoneNumber, role } =
      req.body;
    const { image } = req.body;
    const customer = await stripe.customers.create({
      email,
    });
    const memberData = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      role,
      stripeCustomerId: customer.id,
    };
    await adminMembersServices.createMember({ memberData, image });

    res
      .status(200)
      .cookie("stripe_customer", customer.id, {
        maxAge: 86400000,
        httpOnly: true,
      })
      .json({
        message: lang.en.CREATED_SUCCESSFULLY,
      });
  } catch (error) {
    next(error);
  }
}

export async function deleteMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await adminMembersServices.deleteMember(req.params.memberId);

    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function getMembersByTrainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await adminMembersServices.getMembersByTrainer(
      req.params.trainerId
    );

    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
