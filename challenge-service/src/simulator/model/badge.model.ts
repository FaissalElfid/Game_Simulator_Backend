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
    pronos: { type: Number, required: false },
    recurrent: {type: Number, required: false}, // combien de fois cette condition doit etre verifie pour que je puisse debloqué le challenge
    reunlockable: {type: Number, required: false},
    coins: {type: Number, required: true, default: 50},
    image: { type: String, default: '', required: false },
  });
  export interface Badge extends mongoose.Document {
    id: string;
    title: string;
    description: string;
    pronos: number;
    recurrent: number;
    reunlockable: number;
    coins: number;
    level: string;
    image: string;
  }
  export const BadgeModel = mongoose.model('Badge', BadgeSchema);