export type User = {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName?: string;
    password: string;
    imageUrl: string;
};

export interface IUserSignup {
    email: string;
    password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserLogin extends IUserSignup {}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IUpdateUser {
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
}

export interface IManageObject {
    objectId: string;
}

export type ICreateUser = Omit<User, 'id'>;
