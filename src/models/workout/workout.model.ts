import mongoose, { Schema } from "mongoose";
import { StringLiteral } from "typescript";
export interface IWorkout {
  trainer: string;
  program: string;
  description: string;
  start: Date;
  end: Date;
  title: string;
  textColor: string;
}

export interface WorkoutDocument extends IWorkout, mongoose.Document {
  trainer: string;
  title: string;
  program: string;
  description: string;
  start: Date;
  end: Date;
  textColor: string;
}

const WorkoutSchema = new mongoose.Schema({
  trainer: {
    type: Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide the title of the workout"],
  },
  description: {
    type: String,
    required: [true, "Please provide the description of the workout"],
  },

  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  textColor: String,
});

const Workout = mongoose.model<WorkoutDocument>("Workout", WorkoutSchema);

export default Workout;
