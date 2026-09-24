import React, { useMemo, useState } from 'react';
import { ApartmentOutlined, CalendarMonthOutlined, EventAvailableOutlined, InfoOutlined, SearchOutlined, ScheduleOutlined, WaterDropOutlined } from '@mui/icons-material';
import { formatBookingPeriodDate, getBookingPeriod } from '../utils/bookingPeriod';

const PoolBookingComponent = ({ bookings }) => {
    const [query, setQuery] = useState('');
    const [block, setBlock] = useState('Tümü');
    const bookingList = useMemo(() => bookings?.data || [], [bookings]);
    const bookingPeriod = useMemo(() => getBookingPeriod(bookingList), [bookingList]);

    const getDateFromTimestamp = (timestamp) => new Date(timestamp).toLocaleString('tr-TR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    const filteredBookings = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR').replace('daire', '').trim();
        return bookingList.filter((booking) => {
            const blockMatches = block === 'Tümü' || booking.block === block;
            const queryMatches = !normalizedQuery || String(booking.apartment).includes(normalizedQuery) || booking.block.toLocaleLowerCase('tr-TR').includes(normalizedQuery);
            return blockMatches && queryMatches;
        });
    }, [bookingList, block, query]);

    if (!bookingList.length) {
        return (
            <section className="surface-card empty-state">
                <span className="empty-icon"><WaterDropOutlined /></span>
                <h2>Henüz kura çekilmedi</h2>
                <p>Yeni dönem kura sonuçları yayınlandığında burada görüntülenecek.</p>
            </section>
        );
    }

    return (
        <section className="surface-card results-card">
            <div className="section-heading results-heading">
                <div>
                    <span className="section-kicker">Güncel liste</span>
                    <h2>Kura sonuçları</h2>
                    <p><CalendarMonthOutlined /> {getDateFromTimestamp(bookings.createdAt)} tarihinde yayınlandı</p>
                    {bookingPeriod && <p className="period-end"><EventAvailableOutlined /> Kura dönemi {formatBookingPeriodDate(bookingPeriod.endDate)} tarihinde sona eriyor</p>}
                </div>
                <span className="result-count"><strong>{bookingList.length}</strong> daire</span>
            </div>

            <div className="notice-bar">
                <InfoOutlined />
                <p><strong>Hatırlatma:</strong> Pazartesi günleri havuz kapalıdır. Cumartesi ve pazar günleri aile günü uygulaması yoktur.</p>
            </div>

            <div className="results-toolbar">
                <label className="search-field">
                    <SearchOutlined />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Daire numaranızı arayın" aria-label="Daire numarası ara" />
                </label>
                <div className="block-filter" aria-label="Blok seçimi">
                    {['Tümü', 'A', 'B'].map((item) => (
                        <button key={item} className={block === item ? 'active' : ''} type="button" onClick={() => setBlock(item)}>{item === 'Tümü' ? item : `${item} Blok`}</button>
                    ))}
                </div>
            </div>

            {filteredBookings.length ? (
                <>
                    <div className="booking-table-wrap">
                        <table className="booking-table">
                            <thead><tr><th>Blok</th><th>Daire</th><th>Tarih</th><th>Seans saati</th></tr></thead>
                            <tbody>
                                {filteredBookings.map((booking, index) => (
                                    <tr key={`${booking.block}-${booking.apartment}-${index}`}>
                                        <td><span className={`block-badge block-${booking.block.toLocaleLowerCase()}`}>{booking.block}</span></td>
                                        <td><strong>Daire {booking.apartment}</strong></td>
                                        <td><span className="cell-with-icon"><CalendarMonthOutlined /> {booking.date}</span></td>
                                        <td><span className="session-pill"><ScheduleOutlined /> {booking.session === 1 ? '18:00 — 20:00' : '20:00 — 22:00'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="booking-mobile-list">
                        {filteredBookings.map((booking, index) => (
                            <article className="booking-mobile-card" key={`${booking.block}-${booking.apartment}-mobile-${index}`}>
                                <div className="mobile-card-title">
                                    <span className={`block-badge block-${booking.block.toLocaleLowerCase()}`}>{booking.block}</span>
                                    <div><small>{booking.block} Blok</small><strong>Daire {booking.apartment}</strong></div>
                                    <ApartmentOutlined />
                                </div>
                                <div className="mobile-card-meta">
                                    <span><CalendarMonthOutlined /> {booking.date}</span>
                                    <span><ScheduleOutlined /> {booking.session === 1 ? '18:00 — 20:00' : '20:00 — 22:00'}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            ) : <div className="no-results"><SearchOutlined /><strong>Sonuç bulunamadı</strong><span>Arama veya blok filtresini değiştirmeyi deneyin.</span></div>}
        </section>
    );
};

export default PoolBookingComponent;
