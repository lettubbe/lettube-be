export interface IRegister {
    email: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    gender: string;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IForgotPassword {
    email: string;
}

export interface IResetPassword {
    token: string;
    password: string;
}