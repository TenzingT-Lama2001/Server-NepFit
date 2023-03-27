import Program from "../../models/program/program.model";
import Trainer from "../../models/trainer/trainer.model";
import Workout, { WorkoutDocument } from "../../models/workout/workout.model";

type CreateWorkout = {
  title: string;
  description: string;
  trainerId: string;
  start: Date;
  end: Date;
  textColor: string;
};
export async function createWorkout({
  title,
  description,
  trainerId,
  start,
  end,
  textColor,
}: CreateWorkout) {
  console.log({ title, description, trainerId, start, end });
  const trainer = await Trainer.findById(trainerId);
  const specialty = trainer.specialty;
  console.log({ specialty });
  const program = await Program.find({ name: specialty });
  console.log(program[0]._id);
  const workoutData = {
    title,
    description,
    trainer: trainer._id,
    start,
    end,
    program: program[0]._id,
    textColor,
  };
  console.log({ workoutData });
  const workout = await Workout.create(workoutData);
  return workout;
  // const id = workout._id.toString();
  // return {
  //   id,
  //   title: workout.title,
  //   description: workout.description,
  //   start: workout.start,
  //   end: workout.end,
  //   textColor
  // };
}

export async function getWorkouts() {
  const workouts = await Workout.find();
  const totalWorkouts = workouts.length;
  return { workouts, totalWorkouts };
}

export async function getOneWorkout(id: string) {
  const workout = await Workout.findById(id);
  return workout;
}

type UpdateWorkout = {
  workoutData: Partial<WorkoutDocument>;
  workoutId: string;
};
export async function updateWorkout({ workoutData, workoutId }: UpdateWorkout) {
  const workout = await Workout.findByIdAndUpdate(workoutId, workoutData, {
    new: true,
    runValidators: true,
  });

  return workout;
}
export async function deleteWorkout(workoutId: string) {
  const workout = await Workout.findByIdAndDelete(workoutId);

  return workout;
}

export async function getWorkoutByTrainerId(trainerId: any) {
  console.log(trainerId);
  const trainer = trainerId;
  const workouts = await Workout.find({ trainer });
  console.log(workouts);
  const totalWorkouts = workouts.length;
  return { workouts, totalWorkouts };
}
