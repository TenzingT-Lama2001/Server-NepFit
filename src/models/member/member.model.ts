import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../../config/default";

export interface IMember {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  refreshToken: string;
  forgotPasswordToken: string;
  forgotPasswordExpiry: Date;
}

export interface MemberDocument extends IMember, mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
  forgotPasswordToken: string;
  forgotPasswordExpiry: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getJwtAccessToken: () => string;
  getJwtRefreshToken: () => string;
  getForgotPasswordToken: () => string;
}

const MemberSchema = new mongoose.Schema({
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
  role: {
    type: String,
    default: "member",
  },
  refreshToken: String,
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
});

//encrypt password before save - HOOKS
MemberSchema.pre("save", async function (this: MemberDocument, next) {
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
MemberSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // So we don't have to pass this into the interface method
  const member = this as MemberDocument;

  return await bcrypt
    .compare(candidatePassword, member.password)
    .catch((e) => false);
};

//create and return jwt token

MemberSchema.methods.getJwtAccessToken = function () {
  return jwt.sign({ id: this._id }, config.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: config.JWT_ACCESS_TOKEN_EXPIRY,
  });
};

//create and return jwt refresh token

MemberSchema.methods.getJwtRefreshToken = function () {
  return jwt.sign({ id: this._id }, config.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: config.JWT_REFRESH_TOKEN_EXPIRY,
  });
};

MemberSchema.methods.getForgotPasswordToken = function () {
  //generate a long and random string
  const forgotToken = crypto.randomBytes(20).toString("hex");

  //getting a hash
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  //time of token

  this.forgotPasswordExpiry = new Date(Date.now() + 30 * 60 * 1000);

  return forgotToken;
};
const Member = mongoose.model<MemberDocument>("Member", MemberSchema);

export default Member;
