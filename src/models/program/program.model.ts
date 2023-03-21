import mongoose from "mongoose";
export interface IProgram {
  name: string;
  description: string;
  image: {
    id: string;
    secure_url: string;
  };
}

export interface ProgramDocument extends IProgram, mongoose.Document {
  name: string;
  description: string;
  image: {
    id: string;
    secure_url: string;
  };
}

const ProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the package name"],
    maxlength: [50, "Name should be under 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide package description"],
    maxlength: [300, "Description should be under 300 characters"],
  },
  image: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
});

const Program = mongoose.model<ProgramDocument>("Program", ProgramSchema);

export default Program;
