import * as mongoose from 'mongoose';

const schema = mongoose.Schema;

export const UserSchema = new schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  challenges: [{ type: schema.Types.ObjectId, ref: "Challenge", required: false}],
  level: { type: Number, required: true },
});

export interface User extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  password: string;
  level : number,
  email: string,
  challenges: Array<string>;
}
export interface User{
  id: string;
  title: string;
  description: string;
  level : number,
  password: string;
  email: string,
  challenges: Array<string>;
}
