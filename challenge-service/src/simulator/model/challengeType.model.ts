import * as mongoose from 'mongoose';

const schema = mongoose.Schema;

export const ChallengeTypeSchema = new schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  challenges: [{ type: schema.Types.ObjectId, ref: "challenge", required: false}]
  // ici je doit integrer plusieurs badges chaque badge avec sa condition de réalisation
});

export interface ChallengeType extends mongoose.Document {
  id: string;
  title: string;
  description: string;
}