import { add } from "../demo"

describe ("add test", () => {
    test('adding 1 and 2 should return 3', () => {
        expect(add(1, 2)).toBe(3);
    });
});