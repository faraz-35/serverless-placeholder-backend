export type TObject = {
    id: string;
    name: string;
};

export interface UpdateObjectInput {
    name: string;
}

export interface CreateObjectInput {
    name: string;
}
