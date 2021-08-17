import * as mongoose from 'mongoose';
import { BadgeSchema, Badge } from './badge.model';
const schema = mongoose.Schema;



export const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  reunlockage: { type: Boolean, required: true },
  challengeType: [{ type: schema.Types.ObjectId, ref: "challengeType", required: false}],
  bagdes: [{ type: BadgeSchema, required: false }],
  bagdeSilver: [{ type: BadgeSchema, required: false }],
  bagdeGold: [{ type: BadgeSchema, required: false }],
});



export interface Challenge extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  reunlockage: boolean;
  badges: [Badge];
  bagdeSilver: [Badge];
  bagdeGold: [Badge];
}
// les badges d'un challenge aurrant le meme titre et un enum qui précise dans
// quelle niveau est situé (bronze, silver or gold)
