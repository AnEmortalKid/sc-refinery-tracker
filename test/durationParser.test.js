import { TestScheduler } from 'jest'
import { toSeconds } from '../src/durationParser'

describe('toSeconds', () => {

    test('format: Xs', () => {
        expect(toSeconds('59s')).toBe(59);
    });

    test('format: Xm Xs', () => {
        expect(toSeconds("5m 5s")).toBe(305);
    });

    test('format: Xh Xm Xs', () => {
        var hours = 2 * 60 * 60;
        var mins = 10 * 60;
        var secs = 12;
        expect(toSeconds("2h 10m 12s")).toBe(hours + mins + secs);
    });

    test('format: Xd Xh Xm Xs', () => {
        var days = 3 * 24 * 60 * 60;
        var hours = 2 * 60 * 60;
        var mins = 10 * 60;
        var secs = 12;
        expect(toSeconds("3d 2h 10m 12s")).toBe(days + hours + mins + secs);
    });
});