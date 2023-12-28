export type APIResponse = {
    statusCode: number;
    body: {
        data?: any; //TODO: JSON Object
        error?: string;
        message?: string;
    };
};
