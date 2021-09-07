export interface User{
    id: string;
    title: string;
    description: string;
    email: string;
    level : number;
    password: string;
    role: string;
    challenges: Array<string>;
  }
  export interface CurrentUser{
    id: string;
    title: string;
    description: string;
    email: string;
    level : number;
    role: string;
    challenges: Array<string>;
  }
  export interface UserLoginI{
    password: string;
    email: string;
  }