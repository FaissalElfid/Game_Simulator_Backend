import * as mongoose from 'mongoose';

const schema = mongoose.Schema;

export const ChallengeTypeSchema = new schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  challenges: [{ type: schema.Types.ObjectId, ref: "Challenge", required: false}]
});

export interface ChallengeType extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  challenges: Array<string>;
}
export interface ChallengeTypeI{
  id: string;
  title: string;
  description: string;
  challenges: Array<string>;
}
