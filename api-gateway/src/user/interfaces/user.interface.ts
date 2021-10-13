export interface User{
    id: string;
    name: string;
    description: string;
    email: string;
    level : number;
    password: string;
    role: string;
    profileImage: string;
    challenges: Array<string>;
  }
  export interface CurrentUser{
    id: string;
    name: string;
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
  export interface UserUpdatePassword{
    password: string;
    id: string;
  }
  export interface UpdateCounter{
    counter: number
  }
  export interface UpdateProgress{
    progress: number
  }