export type User = {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName?: string;
    password: string;
    imageUrl: string;
};

export interface UserSignupInput {
    email: string;
    password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserLoginInput extends UserSignupInput {}

export interface ChangeUserPasswordInput {
    oldPassword: string;
    newPassword: string;
}

export interface UpdateUserInput {
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
}

//User Admin Interfaces
export interface CreateUserInput {
    // TODO: extends user escept id
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageUrl: string;
}
