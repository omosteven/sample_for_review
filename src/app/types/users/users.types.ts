export interface IUserLogin {
  email: string;

  password: string;
}

export interface IUserRegister {
  email: string;

  password: string;

  firstName: string;

  lastName: string;
}

export interface IUser {
  firstName?: string;

  lastName?: string;

  country?: string;

  language?: string;

  picture?: string;
}

export interface IUpdatePassword {
  newPassword: string;
}
