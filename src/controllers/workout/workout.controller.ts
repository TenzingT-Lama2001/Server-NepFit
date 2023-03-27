import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import { workoutServices } from "../../services/workout";

export async function createWorkout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const workout = await workoutServices.createWorkout(req.body);
    console.log({ workout });
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
      workout,
    });
  } catch (error) {
    next(error);
  }
}
export async function getWorkouts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await workoutServices.getWorkouts();
    console.log({ data });
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getWorkoutByTrainerId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await workoutServices.getWorkoutByTrainerId(
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

export async function getOneWorkout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await workoutServices.getOneWorkout(req.params.workoutId);
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateWorkout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const workout = await workoutServices.updateWorkout({
      workoutData: req.body,
      workoutId: req.params.workoutId,
    });

    res.status(200).json({
      message: lang.en.UPDATED_SUCCESSFULLY,
      workout,
    });
  } catch (error) {
    next(error);
  }
}
export async function deleteWorkout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const workout = await workoutServices.deleteWorkout(req.params.workoutId);
    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
      workout,
    });
  } catch (error) {
    next(error);
  }
}
