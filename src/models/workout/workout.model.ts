import mongoose, { Schema } from "mongoose";
export interface IWorkout {
  trainer: string;
  program: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface WorkoutDocument extends IWorkout, mongoose.Document {
  trainer: string;
  program: string;
  description: string;
  startDate: Date;
  endDate: Date;
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
  description: {
    type: String,
    required: [true, "Please provide the description of the workout"],
  },

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Workout = mongoose.model<WorkoutDocument>("Workout", WorkoutSchema);

export default Workout;
