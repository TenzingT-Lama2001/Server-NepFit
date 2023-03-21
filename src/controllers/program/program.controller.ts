import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import { packageServices } from "../../services/package";
import { programServices } from "../../services/program";

export async function addProgram(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description } = req.body;
    const { image } = req.body;
    const programData = {
      name,
      description,
    };
    await programServices.addProgram({ programData, image });
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function getPrograms(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await programServices.getPrograms();
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function getOneProgram(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await programServices.getOneProgram(req.params.programId);
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateProgram(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description } = req.body;

    const programData = {
      name,

      description,
    };
    const { image } = req.body;
    await programServices.updateProgram({
      programData,
      programId: req.params.programId,
      image,
    });

    res.status(200).json({
      message: lang.en.UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
export async function deleteProgram(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await programServices.deleteProgram(req.params.programId);
    res.status(200).json({
      message: lang.en.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}
