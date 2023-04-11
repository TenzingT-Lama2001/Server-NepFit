import mongoose, { Schema } from "mongoose";
import { StringLiteral } from "typescript";
export interface IReport {
  member: string;
  date: Date;
  trainer: string;
  introduction: string;
  workout: string;
  progress: string;
  conclusion: string;
  pdf: Buffer;
}

export interface ReportDocument extends IReport, mongoose.Document {
  member: string;
  date: Date;
  trainer: string;
  introduction: string;
  workout: string;
  progress: string;
  conclusion: string;
  pdf: Buffer;
}

const ReportSchema = new mongoose.Schema({
  member: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: new Date(Date.now()),
  },

  trainer: {
    type: Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  workout: {
    type: String,
    required: true,
  },
  progress: {
    type: String,
    required: true,
  },
  conclusion: {
    type: String,
    required: true,
  },
  pdf: {
    type: Buffer,
  },
});

const Report = mongoose.model<ReportDocument>("Report", ReportSchema);

export default Report;
