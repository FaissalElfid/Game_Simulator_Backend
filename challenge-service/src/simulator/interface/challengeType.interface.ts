export interface IChallenge {
    id: string;
    title: string;
    description: string;
}
export interface IChallengeId {
    id: string;
    title: string;
    description: string;
}
export interface ChallengeType{
    id: string;
    title: string;
    description: string;
    challenges: Array<string>;
  }