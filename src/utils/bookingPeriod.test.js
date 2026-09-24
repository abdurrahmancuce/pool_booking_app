import { formatBookingPeriodDate, getBookingPeriod, isBookingPeriodActive } from './bookingPeriod';

describe('kura dönemi', () => {
    const bookings = [
        { date: '30.09.2026' },
        { date: '22.09.2026' },
        { date: '15.10.2026' },
    ];

    test('ilk günü, son günü ve yeni kura tarihini hesaplar', () => {
        const period = getBookingPeriod(bookings);

        expect(formatBookingPeriodDate(period.startDate)).toBe('22 Eylül 2026');
        expect(formatBookingPeriodDate(period.endDate)).toBe('15 Ekim 2026');
        expect(formatBookingPeriodDate(period.nextDrawDate)).toBe('16 Ekim 2026');
    });

    test('son gün dahil aktif olduğunu kabul eder', () => {
        expect(isBookingPeriodActive(bookings, new Date(2026, 9, 15, 23, 59))).toBe(true);
        expect(isBookingPeriodActive(bookings, new Date(2026, 9, 16))).toBe(false);
    });

    test('boş veya geçersiz listede dönem üretmez', () => {
        expect(getBookingPeriod([])).toBeNull();
        expect(getBookingPeriod([{ date: 'geçersiz' }])).toBeNull();
    });
});
