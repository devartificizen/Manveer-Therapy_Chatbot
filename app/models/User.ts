import { Schema, model, models, Document, Types, Model as MongooseModel, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  image?: string; 
  chats?: Types.ObjectId[]; 
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Username is required"],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
    ],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, 
    index: true, 
  },
  image: {
    type: String,
  },
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat", 
    },
  ],
});

userSchema.index({ email: 1 }, { unique: true });

// Fix model creation to handle Next.js hot reloading
const User = models?.User ? (models.User as Model<IUser>) : model<IUser>("User", userSchema);

export default User;
