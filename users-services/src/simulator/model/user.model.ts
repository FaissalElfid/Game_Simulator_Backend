import * as mongoose from 'mongoose';

const schema = mongoose.Schema;

export const UserSchema = new schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: false },
  refreshToken: { type: String, required: false, select: false  },
  refreshTokenExp: { type: String, required: false, select: false  },
  password: { type: String, required: true, select: false },
  challenges: [{ type: schema.Types.ObjectId, ref: "Challenge", required: false}],
  level: { type: Number, required: false, default:1 },
});

export interface User extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  password: string;
  isAdmin: boolean;
  level : number,
  email: string,
  refreshToken: string,
  refreshTokenExp: string,
  challenges: Array<string>;
}
export interface User{
  id: string;
  name: string;
  refreshToken: string;
  refreshTokenExp: string,
  description: string;
  isAdmin: boolean;
  level : number,
  password: string;
  email: string,
  challenges: Array<string>;
}
