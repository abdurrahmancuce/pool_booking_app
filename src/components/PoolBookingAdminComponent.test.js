import dayjs from 'dayjs';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PoolBookingAdminComponent, { createFairBookings } from './PoolBookingAdminComponent';
import { addPoolBookList } from '../firebase';

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

describe('aktif kura uyarısı', () => {
    test('aktif dönem bitmeden kura çekildiğinde devam onayı ister', () => {
        const setBookings = jest.fn();
        render(
            <PoolBookingAdminComponent
                bookings={{ createdAt: Date.now(), data: [{ date: '31.12.2099' }] }}
                setBookings={setBookings}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: /kura çek/i }));

        expect(screen.getByRole('dialog')).toHaveTextContent('Aktif kura süresi henüz bitmedi');
        expect(setBookings).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: /yine de devam et/i }));

        expect(setBookings).toHaveBeenCalledTimes(1);
        expect(setBookings.mock.calls[0][0]).toHaveLength(60);
    });
});

describe('yayınlama onayı', () => {
    test('onay verilmeden kura listesini yayınlamaz', async () => {
        const setBookings = jest.fn();
        addPoolBookList.mockResolvedValue();
        render(<PoolBookingAdminComponent bookings={{ data: [] }} setBookings={setBookings} />);

        fireEvent.click(screen.getByRole('button', { name: /kura çek/i }));
        fireEvent.click(screen.getByRole('button', { name: /^yayınla$/i }));

        expect(screen.getByRole('dialog')).toHaveTextContent('Kura sonuçları yayınlansın mı?');
        expect(addPoolBookList).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: /onayla ve yayınla/i }));

        await waitFor(() => expect(addPoolBookList).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(screen.getByText('Kura sonuçları başarıyla yayınlandı.')).toBeInTheDocument());
    });
});
