import { User } from "../model/user.model";

export interface UserUpdate{
 id: string;
 user: User;
}
 export interface UserLoginI{
    email: string;
    password: User;
 }
 export interface UserUpdatePassword{
   id: string;
   password: string;
}