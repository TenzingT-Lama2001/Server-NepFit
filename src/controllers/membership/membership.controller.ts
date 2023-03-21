import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import { membershipServices } from "../../services/membership";

export async function createMembership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await membershipServices.createMembership(req.body);
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
    });
    res.status;
  } catch (error) {
    next(error);
  }
}

export async function getMemberships(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await membershipServices.getMemberships({
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

export async function getOneMembership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await membershipServices.getOneMembership(
      req.params.membershipId
    );
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMembership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { member, program, packages, startDate, endDate, isActive } =
      req.body;

    const membershipData = {
      member,
      program,
      packages,
      startDate,
      endDate,
      isActive,
    };
    await membershipServices.updateMembership({
      membershipData,
      membershipId: req.params.membershipId,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMembership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await membershipServices.deleteMembership(req.params.membershipId);
    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
