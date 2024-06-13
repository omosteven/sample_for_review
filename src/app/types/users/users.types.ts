import { ObjectId } from "mongoose";

// --- used only in user login ---
export interface IUserLogin {
  email: string;

  password: string;
}

// --- used only in user registration ---
export interface IUserRegister {
  email: string;

  password: string;

  firstName: string;

  lastName: string;
}

// --- used in update profile ---
export interface IUser {
  firstName?: string;

  lastName?: string;

  country?: string;

  language?: string;

  picture?: string;
}

/** --- IUserId used in 
delete account, 
get profile, 
delete picture, 
deactivate account,
**/

export interface IUserId {
  userId: ObjectId;
}

export interface IUpdatePassword {
  newPassword: string;
}
