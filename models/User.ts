import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password before saving:
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Only hash the password if it has been modified or is new
    this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt round of 10,
  }
  next();
});

const User = models?.User || model<IUser>("User", userSchema); // Use existing model if it exists, otherwise create a new one

export default User;