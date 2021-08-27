import * as mongoose from 'mongoose';
import { BadgeModel, Badge, BadgeSchema } from './badge.model';
const schema = mongoose.Schema;

export const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  reunlockable: { type: Boolean, required: false },
  challengeType: {
    type: schema.Types.ObjectId,
    ref: 'ChallengeType',
    required: false,
  },
  badges: [{ type: BadgeSchema, required: false }],
  badgeSilver: [{ type: BadgeSchema, required: false }],
  badgeGold: [{ type: BadgeSchema, required: false }],
},{strict: false});

export interface ChallengeSave {
  challenge: Challenge;
  typeChallengeId: string;
}

export interface Challenge extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  reunlockable: boolean;
  challengeType: string;
  badges: [Badge];
  badgeSilver: [Badge];
  badgeGold: [Badge];
}

// construc
