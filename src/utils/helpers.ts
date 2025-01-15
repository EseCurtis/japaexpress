/* eslint-disable @typescript-eslint/no-explicit-any */
export function stripSensitiveProperties<T extends Record<string, any>, K extends keyof T>(
    object: T,
    propertiesArray: K[]
): Omit<T, K> {
    // Create a shallow copy of the object to avoid mutating the original
    const result = { ...object };

    // Loop through each property in the propertiesArray
    propertiesArray.forEach(property => {
        // If the property exists in the object, delete it
        delete result[property];
    });

    return result;
}