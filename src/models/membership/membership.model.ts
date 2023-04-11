import mongoose, { Schema } from "mongoose";
import { StringLiteral } from "typescript";
export interface IMembership {
  member: string;
  program: string;
  packages: string;
  startDate: Date;
  endDate: Date;
  trainer: string;
}

export interface MembershipDocument extends IMembership, mongoose.Document {
  member: string;
  program: string;
  packages: string;
  startDate: Date;
  endDate: Date;
  trainer: string;
}

const MembershipSchema = new mongoose.Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  packages: {
    type: Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  trainer: {
    type: Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },
});

const Membership = mongoose.model<MembershipDocument>(
  "Membership",
  MembershipSchema
);

export default Membership;
