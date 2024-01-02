export const validateInput = (input: Record<string, unknown>): true | string[] => {
    const invalidKeys: string[] = [];
    for (const key in input) {
        if (input[key] === undefined || input[key] === null) {
            invalidKeys.push(key);
        }
    }
    return invalidKeys.length > 0 ? invalidKeys : true;
};
