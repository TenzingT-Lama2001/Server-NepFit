import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";

import { GetMembers } from "../../services/admin/members.service";
import { adminTrainerServices } from "../../services/trainer";

export async function getTrainers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.query);
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await adminTrainerServices.getTrainers({
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

export async function getOneTrainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await adminTrainerServices.getOneTrainer(req.params.trainerId);

    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function getTrainerByProgramId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await adminTrainerServices.getTrainerByProgramId(
      req.params.programId
    );

    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTrainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      role,
      specialty,
      classTime,
    } = req.body;
    const { image } = req.body;
    const trainerData = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      role,
      specialty,
      classTime,
    };
    await adminTrainerServices.updateTrainer({
      trainerData,
      trainerId: req.params.trainerId,
      image,
    });

    res.status(200).json({
      message: lang.en.UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function createTrainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      role,
      specialty,
      classTime,
    } = req.body;
    const { image } = req.body;
    const trainerData = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      role,
      specialty,
      classTime,
    };
    await adminTrainerServices.createTrainer({ trainerData, image });

    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTrainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await adminTrainerServices.deleteTrainer(req.params.trainerId);

    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
