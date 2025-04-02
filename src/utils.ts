/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapToObject(map: Map<string, any>) {
    const obj = {};
    for (const [key, value] of map) {
        // @ts-ignore
        obj[key] = value instanceof Map ? mapToObject(value) : value;
    }
    return obj;
}
