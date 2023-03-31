import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import { adminStaffServices } from "../../services/staff";

export async function getStaffs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.query);
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await adminStaffServices.getStaffs({
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

export async function getOneStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await adminStaffServices.getOneStaff(req.params.staffId);

    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { firstName, lastName, email, password, address, phoneNumber, role } =
      req.body;
    const { image } = req.body;
    const staffData = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      role,
    };
    await adminStaffServices.updateStaff({
      staffData,
      staffId: req.params.staffId,
      image,
    });

    res.status(200).json({
      message: lang.en.UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function createStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log({ req });
    console.log("createStaff req body", req.body);
    const { firstName, lastName, email, password, address, phoneNumber, role } =
      req.body;
    const { image } = req.body;
    const staffData = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      role,
    };
    await adminStaffServices.createStaff({ staffData, image });

    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await adminStaffServices.deleteStaff(req.params.staffId);

    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
