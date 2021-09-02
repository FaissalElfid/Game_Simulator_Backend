export interface User{
    id: string;
    title: string;
    description: string;
    email: string;
    level : number;
    password: string;
    challenges: Array<string>;
  }
  export interface UserLoginI{
    password: string;
    email: string;
  }