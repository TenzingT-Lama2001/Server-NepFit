import { SortOrder } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Trainer, { TrainerDocument } from "../../models/trainer/trainer.model";
import Program from "../../models/program/program.model";
export type GetTrainers = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
  sortBy: string;
  order: string;
};

export async function getTrainers({
  pageNumber,
  pageSize,
  searchQuery,
  sortBy,
  order,
}: GetTrainers) {
  console.log(pageNumber, pageSize, searchQuery, sortBy, order);
  const regex = new RegExp(searchQuery, "i");
  const pageNumberPositive = Math.max(pageNumber + 1, 1);
  const query = Trainer.find({
    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
  })
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const trainers = await query;
  const totalTrainers = await Trainer.countDocuments({
    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
  });
  return {
    trainers: trainers,
    totalTrainers: totalTrainers,
  };
}
export async function getOneTrainer(id: string) {
  const trainer = await Trainer.findById(id);
  return trainer;
}
export async function getTrainerByProgramId(id: string) {
  const program = await Program.findById(id);
  const { name } = program;
  console.log({ name });
  const trainer = await Trainer.find({ specialty: name });
  console.log({ trainer });
  return trainer;
}

type UpdateTrainer = {
  trainerData: Partial<TrainerDocument>;
  trainerId: string;
  image: string;
};

export async function updateTrainer({
  trainerData,
  trainerId,
  image,
}: UpdateTrainer) {
  if (trainerData.password === "" || trainerData.password === null) {
    delete trainerData.password;
  }
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "trainer-profile",
    });

    const { public_id, secure_url } = response;
    const trainerImage = {
      id: public_id,
      secure_url,
    };
    const trainerDataWithProfile = { ...trainerData, avatarUrl: trainerImage };
    await Trainer.findByIdAndUpdate(trainerId, trainerDataWithProfile, {
      new: true,
      runValidators: true,
    });
  } else {
    await Trainer.findByIdAndUpdate(trainerId, trainerData, {
      new: true,
      runValidators: true,
    });
  }
}

export async function deleteTrainer(trainerId: string) {
  await Trainer.findByIdAndDelete(trainerId);
}
type CreateTrainer = {
  trainerData: Partial<TrainerDocument>;
  image?: string;
};
export async function createTrainer({ trainerData, image }: CreateTrainer) {
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "trainer-profile",
    });

    const { public_id, secure_url } = response;
    const trainerImage = {
      id: public_id,
      secure_url,
    };
    const trainerDataWithProfile = { ...trainerData, avatarUrl: trainerImage };
    await Trainer.create(trainerDataWithProfile);
    console.log({ response });
  } else {
    await Trainer.create(trainerData);
  }
}
