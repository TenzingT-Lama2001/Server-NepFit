import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import { workoutServices } from "../../services/workout";
import { reportServices } from "../../services/report";

export async function createReport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const report = await reportServices.createReport(req.body);
    console.log(req.body);
    console.log({ report });
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
      report,
    });
  } catch (error) {
    next(error);
  }
}
export async function getReports(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await reportServices.getReports();

    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReportByMemberId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.query);
    const data = await reportServices.getReportByMemberId(
      req.query.memberId as any
    );
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMembersByTrainerId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await reportServices.getMembersByTrainerId(
      req.query.trainerId
    );
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
