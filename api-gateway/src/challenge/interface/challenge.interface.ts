import { Badge } from "src/badges/interfaces/badge.interface";

export interface Challenge {
    id: string;
  title: string;
  description: string;
  reunlockable: boolean;

}
export interface ChallengeSave {
  challenge: Challenge;
  typeChallengeId: string;
}

export interface Challenge{
  id: string;
  title: string;
  description: string;
  reunlockable: boolean;
  challengeType: string;
  badges: [Badge];
  bagdeSilver: [Badge];
  bagdeGold: [Badge];
}