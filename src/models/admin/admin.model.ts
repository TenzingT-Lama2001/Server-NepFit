import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

export interface IAdmin {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AdminDocument extends IAdmin, mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide your first name"],
    maxlength: [10, "Name should be under 10 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name"],
    maxlength: [10, "Name should be under 10 characters"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password"],
    minlength: [6, "Password must be atleast 6 characters"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: [validator.isEmail, "Please enter email in correct format"],
    unique: true,
  },
});

//encrypt password before save - HOOKS
adminSchema.pre("save", async function (this: AdminDocument, next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  //Random additional data

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(this.password, salt);
  this.password = hash;

  return next();
});

//validate the password with passed on user password - METHODS
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // So we don't have to pass this into the interface method
  const admin = this as AdminDocument;

  return await bcrypt
    .compare(candidatePassword, admin.password)
    .catch((e) => false);
};

export default mongoose.model<AdminDocument>("Admin", adminSchema);
