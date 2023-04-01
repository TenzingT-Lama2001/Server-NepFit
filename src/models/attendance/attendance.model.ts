import mongoose, { Schema } from "mongoose";
import { BadRequestError } from "../../errors";
import { format, parseISO } from "date-fns";

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
    type: String,
    required: true,
    set: function (date: Date): string {
      return format(new Date(date), "yyyy-MM-dd");
    },
    get: function (date: string): Date {
      return parseISO(date);
    },
  },

  is_present: Boolean,
});

const Attendance = mongoose.model<AttendanceDocument>(
  "Attendance",
  AttendanceSchema
);

export default Attendance;
