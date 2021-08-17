import * as mongoose from 'mongoose';
const schema = mongoose.Schema;

export const BadgeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    level: {
      type: String,
      enum: ['none', 'bronze', 'silver', 'gold'],
      default: 'none',
    },
    pronos: { type: Number, required: true },
  });
  export interface Badge extends mongoose.Document {
    id: string;
    title: string;
    description: string;
    pronos: number;
    level: string;
  }