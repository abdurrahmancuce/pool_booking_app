import dayjs from 'dayjs';
import { createFairBookings } from './PoolBookingAdminComponent';

jest.mock('../firebase', () => ({
    addPoolBookList: jest.fn(),
}));

describe('adil kura üretimi', () => {
    test('her daireyi yalnızca bir kez ve seanslara eşit dağıtır', () => {
        const bookings = createFairBookings(dayjs('2026-09-22'), '0,1,6');
        const apartmentKeys = bookings.map(({ block, apartment }) => `${block}-${apartment}`);

        expect(bookings).toHaveLength(60);
        expect(new Set(apartmentKeys).size).toBe(60);
        expect(bookings.filter(({ block }) => block === 'A')).toHaveLength(12);
        expect(bookings.filter(({ block }) => block === 'B')).toHaveLength(48);
        expect(bookings.filter(({ session }) => session === 1)).toHaveLength(30);
        expect(bookings.filter(({ session }) => session === 2)).toHaveLength(30);
    });

    test('kapalı günlere seans oluşturmaz', () => {
        const bookings = createFairBookings(dayjs('2026-09-22'), '0,1,6');
        const bookingDays = bookings.map(({ date }) => {
            const [day, month, year] = date.split('.').map(Number);
            return new Date(year, month - 1, day).getDay();
        });

        expect(bookingDays.some((day) => [0, 1, 6].includes(day))).toBe(false);
    });

    test('haftanın tamamı kapalı seçilemez', () => {
        expect(() => createFairBookings(dayjs('2026-09-22'), '0,1,2,3,4,5,6')).toThrow('en az bir günü');
    });
});
