import { NextFunction, Request, Response } from "express";
import { lang } from "../../lang";
import Attendance from "../../models/attendance/attendance.model";
import { attendanceServices } from "../../services/attendance";
import { CreateAttendance } from "../../services/attendance/attendance.service";
import { productServices } from "../../services/product";

// export async function createAttendance(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     console.log("req.body", req.body);
//     const { memberId, date, is_present } = req.body;
//     console.log({ memberId, date, is_present });
//     // const attendanceData = {
//     //   member: memberId,
//     //   date,
//     //   is_present,
//     // };
//     // const attendance = await attendanceServices.createAttendance({
//     //   attendanceData,
//     // });
//     res.status(200).json({
//       message: lang.en.CREATED_SUCCESSFULLY,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

export async function createAttendance(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("req.body", req.body);
    const attendanceData = req.body;
    for (const data of attendanceData) {
      const { memberId, date, is_present } = data;
      console.log("dest", { memberId, date, is_present });
      const attendance = await attendanceServices.createAttendance({
        attendanceData: { member: memberId, date, is_present },
      });
      console.log("attendance", attendance);
    }
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
    });
  } catch (error) {
    next(error);
  }
}

// export async function getAttendance(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const { memberId, date } = req.params;

//     const attendanceData: AttendanceData = {
//       member: memberId,
//       date: new Date(date),
//     };

//     const attendance = await attendanceServices.getAttendance({
//       attendanceData,
//     });
//     res.status(200).json({
//       message: lang.en.FETCHED_SUCCESSFULLY,
//       attendance,
//     });
//   } catch (error) {
//     next(error);
//   }
// }
interface AttendanceData {
  date: Date;
}

export async function getAttendance(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { date } = req.query;
    const attendanceData: AttendanceData = {
      date: new Date(Date.parse(date as string)),
    };

    const data = await attendanceServices.getAttendance({
      attendanceData,
    });
    res.status(200).json({
      message: lang.en.FETCHED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMembersFromMembership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { pageNumber, pageSize, searchQuery, sortBy, order } = req.query;
    const data = await attendanceServices.getMembersFromMembership({
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      searchQuery: searchQuery as string,
      sortBy: sortBy as string,
      order: order as string,
    });
    res.status(200).json({
      message: lang.en.CREATED_SUCCESSFULLY,
      data,
    });
  } catch (error) {
    next(error);
  }
}
