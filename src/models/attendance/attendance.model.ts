import mongoose, { Schema } from "mongoose";
import { BadRequestError } from "../../errors";
export interface IAttendance {
  member: string;
  date: Date;
  is_present: Boolean;
}

export interface AttendanceDocument extends IAttendance, mongoose.Document {
  member: string;
  date: Date;
  is_present: Boolean;
}

const AttendanceSchema = new mongoose.Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  is_present: Boolean,
});

const Attendance = mongoose.model<AttendanceDocument>(
  "Attendance",
  AttendanceSchema
);

export default Attendance;
