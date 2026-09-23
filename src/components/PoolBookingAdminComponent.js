import React, { useState } from 'react';
import { CircularProgress, TextField } from '@material-ui/core';
import { Alert, Snackbar } from '@mui/material';
import { AdminPanelSettingsOutlined, CalendarMonthOutlined, CasinoOutlined, CheckCircleOutline, PublishOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { addPoolBookList } from '../firebase';

const getSecureRandomIndex = (maxExclusive) => {
    const cryptoApi = typeof window !== 'undefined' ? window.crypto : undefined;

    if (!cryptoApi?.getRandomValues) {
        return Math.floor(Math.random() * maxExclusive);
    }

    const range = 0x100000000;
    const unbiasedLimit = range - (range % maxExclusive);
    const randomValue = new Uint32Array(1);

    do {
        cryptoApi.getRandomValues(randomValue);
    } while (randomValue[0] >= unbiasedLimit);

    return randomValue[0] % maxExclusive;
};

const shuffleApartments = (apartments) => {
    const shuffled = [...apartments];

    for (let index = shuffled.length - 1; index > 0; index--) {
        const randomIndex = getSecureRandomIndex(index + 1);
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
};

export const createFairBookings = (startDate, vacationDays) => {
    const vacationDaysArr = vacationDays
        .split(',')
        .map((day) => day.trim())
        .filter(Boolean)
        .map(Number);

    const hasInvalidDay = vacationDaysArr.some((day) => !Number.isInteger(day) || day < 0 || day > 6);
    if (hasInvalidDay) throw new Error('Tatil günlerini 0 ile 6 arasında, virgülle ayırarak girin.');
    if (new Set(vacationDaysArr).size === 7) throw new Error('Haftanın en az bir günü kullanıma açık olmalıdır.');

    const apartments = [
        ...Array.from({ length: 12 }, (_, index) => ({ block: 'A', apartment: index + 1 })),
        ...Array.from({ length: 48 }, (_, index) => ({ block: 'B', apartment: index + 1 })),
    ];
    const shuffledApartments = shuffleApartments(apartments);
    const generatedBookings = [];
    const currentDate = startDate.toDate();
    currentDate.setHours(12, 0, 0, 0);

    while (generatedBookings.length < shuffledApartments.length) {
        if (!vacationDaysArr.includes(currentDate.getDay())) {
            for (let session = 1; session <= 2 && generatedBookings.length < shuffledApartments.length; session++) {
                const apartment = shuffledApartments[generatedBookings.length];
                generatedBookings.push({
                    date: currentDate.toLocaleDateString('tr-TR'),
                    apartment: apartment.apartment,
                    block: apartment.block,
                    session,
                });
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return generatedBookings.sort((a, b) => a.block !== b.block ? a.block.localeCompare(b.block) : a.apartment - b.apartment);
};

const PoolBookingAdminComponent = ({ bookings, setBookings }) => {
    const [startDate, setStartDate] = useState(dayjs(new Date()));
    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [vacationDays, setVacationDays] = useState('0,1,6');
    const [notification, setNotification] = useState({ open: false, severity: 'success', message: '' });

    const showNotification = (severity, message) => setNotification({ open: true, severity, message });

    const generateBookings = () => {
        if (!startDate) {
            showNotification('error', 'Lütfen başlangıç tarihini seçin.');
            return;
        }

        try {
            const newBookings = createFairBookings(startDate, vacationDays);
            setBookings(newBookings);
            setIsReady(true);
            showNotification('success', 'Yeni kura oluşturuldu. Listeyi kontrol ederek yayınlayabilirsiniz.');
        } catch (error) {
            setIsReady(false);
            showNotification('error', error.message);
        }
    };

    const publishList = async () => {
        setLoading(true);
        try {
            await addPoolBookList(bookings);
            setIsReady(false);
            showNotification('success', 'Kura sonuçları başarıyla yayınlandı.');
        } catch (error) {
            showNotification('error', 'Kura sonuçları yayınlanamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="surface-card admin-card">
            <div className="section-heading admin-heading">
                <div className="admin-title-icon"><AdminPanelSettingsOutlined /></div>
                <div><span className="section-kicker">Yönetici alanı</span><h2>Yeni kura oluştur</h2><p>Başlangıç tarihini belirleyin ve dağılımı hazırlayın.</p></div>
                <span className="secure-badge"><span /> Yetkili oturum</span>
            </div>

            <div className="admin-form-grid">
                <label className="admin-field-label">
                    <span><CalendarMonthOutlined /> Başlangıç tarihi</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                        <DatePicker value={startDate} format="DD/MM/YYYY" onChange={(newValue) => setStartDate(newValue)} slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
                    </LocalizationProvider>
                    <small className="admin-control-note">Kura döneminin ilk günü</small>
                </label>
                <label className="admin-field-label">
                    <span>Tatil günleri</span>
                    <TextField variant="outlined" size="small" fullWidth value={vacationDays} onChange={(event) => setVacationDays(event.target.value.replace(' ', ''))} />
                    <small className="admin-control-note">0=Pazar, 1=Pazartesi, 6=Cumartesi</small>
                </label>
                <button className="draw-action" type="button" onClick={generateBookings}><CasinoOutlined /> Kura çek</button>
                <button className="publish-action" disabled={loading || !isReady} type="button" onClick={publishList}>
                    {loading ? <CircularProgress size={21} color="inherit" /> : <PublishOutlined />}{loading ? 'Yayınlanıyor…' : 'Yayınla'}
                </button>
            </div>

            {isReady && <div className="draft-notice"><CheckCircleOutline /><span><strong>Kura hazır.</strong> Aşağıdaki listeyi kontrol edip yayınlayabilirsiniz.</span></div>}
            <Snackbar open={notification.open} autoHideDuration={5000} onClose={() => setNotification((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={notification.severity} variant="filled" onClose={() => setNotification((current) => ({ ...current, open: false }))}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </section>
    );
};

export default PoolBookingAdminComponent;
