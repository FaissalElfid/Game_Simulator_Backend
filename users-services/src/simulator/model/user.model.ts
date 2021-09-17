import * as mongoose from 'mongoose';

const schema = mongoose.Schema;

export const UserSchema = new schema({
  name: { type: String, required: true },
  lastName: { type: String, required: false, default:"" },
  description: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: false },
  profileImage: { type: String, default: '', required: false },
  refreshToken: { type: String, required: false, select: false  },
  refreshTokenExp: { type: String, required: false, select: false  },
  password: { type: String, required: true, select: false },
  challenges: [{ type: schema.Types.ObjectId, ref: "Challenge", required: false}],
  level: { type: Number, required: false, default:1 },
});

export interface User extends mongoose.Document {
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  description: string;
  password: string;
  isAdmin: boolean;
  level : number,
  profileImage: string,
  email: string,
  refreshToken: string,
  refreshTokenExp: string,
  challenges: Array<string>;
}
export interface User{
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  refreshToken: string;
  refreshTokenExp: string,
  profileImage: string,
  description: string;
  isAdmin: boolean;
  level : number,
  password: string;
  email: string,
  challenges: Array<string>;
}
