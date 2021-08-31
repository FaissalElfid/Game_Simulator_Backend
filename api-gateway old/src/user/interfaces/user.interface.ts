export interface User{
    id: string;
    title: string;
    description: string;
    email: string;
    level : number;
    challenges: Array<string>;
  }