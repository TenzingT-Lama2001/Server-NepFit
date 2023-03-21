import { SortOrder } from "mongoose";
import Program, { ProgramDocument } from "../../models/program/program.model";
import { v2 as cloudinary } from "cloudinary";
type CreateProgram = {
  programData: Partial<ProgramDocument>;
  image?: string;
};
export async function addProgram({ programData, image }: CreateProgram) {
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "program-image",
    });

    const { public_id, secure_url } = response;
    const programImage = {
      id: public_id,
      secure_url,
    };
    const programDataWithImage = { ...programData, image: programImage };
    await Program.create(programDataWithImage);
    console.log({ response });
  } else {
    await Program.create(programData);
  }
}

export async function getPrograms() {
  const programs = await Program.find();
  const totalPrograms = programs.length;
  return { programs, totalPrograms };
}

export async function getOneProgram(id: string) {
  const program = await Program.findById(id);
  return program;
}

type UpdateProgram = {
  programData: Partial<ProgramDocument>;
  programId: string;
  image?: string;
};
export async function updateProgram({
  programData,
  programId,
  image,
}: UpdateProgram) {
  if (image) {
    const response = await cloudinary.uploader.upload(image, {
      folder: "program-image",
    });

    const { public_id, secure_url } = response;
    const programImage = {
      id: public_id,
      secure_url,
    };
    const programDataWithProfile = { ...programData, avatarUrl: programImage };
    await Program.findByIdAndUpdate(programId, programDataWithProfile, {
      new: true,
      runValidators: true,
    });
  } else {
    await Program.findByIdAndUpdate(programId, programData, {
      new: true,
      runValidators: true,
    });
  }
}
export async function deleteProgram(programId: string) {
  await Program.findByIdAndDelete(programId);
}
