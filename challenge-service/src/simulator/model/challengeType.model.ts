import * as mongoose from 'mongoose';

export const ChallengeTypeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // ici je doit integrer plusieurs badges chaque badge avec sa condition de réalisation
});

export interface ChallengeType extends mongoose.Document {
  id: string;
  title: string;
  description: string;
}