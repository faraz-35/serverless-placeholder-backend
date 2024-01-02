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

//User Admin Interfaces
export interface ICreateUser {
    // TODO: extends user escept id
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageUrl: string;
}
