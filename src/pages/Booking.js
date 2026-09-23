import { useEffect, useState } from 'react';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { LoginOutlined, LogoutOutlined, PaletteOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PoolBookingComponent from '../components/PoolBookingComponent';
import PoolBookingAdminComponent from '../components/PoolBookingAdminComponent';
import SeasonalArtwork from '../components/SeasonalArtwork';
import SeasonalAmbience from '../components/SeasonalAmbience';
import { getLastPoolBookList } from '../firebase';
import logo from '../logo.svg';
import '../App.css';

export const MONTH_THEMES = [
    { id: 'january', label: 'Ocak', season: 'Kış' },
    { id: 'february', label: 'Şubat', season: 'Kış' },
    { id: 'march', label: 'Mart', season: 'İlkbahar' },
    { id: 'april', label: 'Nisan', season: 'İlkbahar' },
    { id: 'may', label: 'Mayıs', season: 'İlkbahar' },
    { id: 'june', label: 'Haziran', season: 'Yaz' },
    { id: 'july', label: 'Temmuz', season: 'Yaz' },
    { id: 'august', label: 'Ağustos', season: 'Yaz' },
    { id: 'september', label: 'Eylül', season: 'Sonbahar' },
    { id: 'october', label: 'Ekim', season: 'Sonbahar' },
    { id: 'november', label: 'Kasım', season: 'Sonbahar' },
    { id: 'december', label: 'Aralık', season: 'Kış' },
];

const isDevelopment = process.env.NODE_ENV === 'development';

function Booking() {
    const navigate = useNavigate();
    const [previewMonth, setPreviewMonth] = useState(() => {
        const currentMonth = new Date().getMonth();
        if (!isDevelopment) return currentMonth;
        const savedMonth = Number(localStorage.getItem('previewMonth'));
        return Number.isInteger(savedMonth) && savedMonth >= 0 && savedMonth <= 11 ? savedMonth : currentMonth;
    });
    const [bookings, setBookings] = useState([]);
    const [userCredential, setUserCredential] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const credential = JSON.parse(localStorage.getItem('userCredential'));
        setUserCredential(credential);
        getPoolBookList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPoolBookList = async () => {
        setLoading(true);
        try {
            const poolBookList = await getLastPoolBookList();
            setBookings(poolBookList);
        } catch (error) {
            setBookings([]);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    };

    const setBookingsCallback = (data) => {
        setBookings({ createdAt: Date.now(), data });
    };

    const logout = () => {
        localStorage.removeItem('userCredential');
        navigate('/login');
    };

    const changePreviewMonth = (event) => {
        const selectedMonth = Number(event.target.value);
        setPreviewMonth(selectedMonth);
        localStorage.setItem('previewMonth', selectedMonth);
    };

    const activeTheme = MONTH_THEMES[previewMonth];

    return (
        <div className={`app-shell month-${activeTheme.id}`}>
            <SeasonalAmbience season={activeTheme.season} month={activeTheme.id} />
            <header className="site-header">
                <div className="page-container header-inner">
                    <button className="brand" type="button" onClick={() => navigate('/')} aria-label="Ana sayfa">
                        <span className="brand-mark"><img src={logo} alt="" /></span>
                        <span><strong className="brand-name">Eke Park Sitesi</strong><small>HAVUZ KURASI</small></span>
                    </button>
                    <div className="header-controls">
                        {isDevelopment && (
                            <label className="month-preview-control">
                                <PaletteOutlined />
                                <span>Ay önizleme</span>
                                <select value={previewMonth} onChange={changePreviewMonth} aria-label="Tema ayını seç">
                                    {MONTH_THEMES.map((month, index) => <option key={month.id} value={index}>{month.label} — {month.season}</option>)}
                                </select>
                            </label>
                        )}
                        <button className="header-action" type="button" onClick={userCredential ? logout : () => navigate('/login')}>
                            {userCredential ? <LogoutOutlined /> : <LoginOutlined />}
                            <span>{userCredential ? 'Çıkış yap' : 'Yönetici girişi'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <section className="hero-section">
                    <div className="page-container hero-content">
                        <div className="eyebrow"><span /> Eke Park Sitesi</div>
                        <h1>Aile havuz kullanım kurası</h1>
                        <p>Daireniz için belirlenen havuz kullanım gününü ve seans saatini aşağıdaki listeden kontrol edebilirsiniz.</p>
                        <div className="session-summary" aria-label="Seans saatleri">
                            <div><span>1. Seans</span><strong>18:00 — 20:00</strong></div>
                            <div className="session-divider" />
                            <div><span>2. Seans</span><strong>20:00 — 22:00</strong></div>
                        </div>
                    </div>
                    <SeasonalArtwork month={activeTheme.id} />
                    <div className="hero-orb hero-orb-one" />
                    <div className="hero-orb hero-orb-two" />
                </section>

                <div className="page-container content-stack">
                    {userCredential && <PoolBookingAdminComponent bookings={bookings} setBookings={setBookingsCallback} />}
                    {loading ? (
                        <section className="surface-card loading-card" aria-live="polite">
                            <CircularProgress size={36} />
                            <strong>Kura sonuçları getiriliyor</strong>
                            <span>Lütfen kısa bir süre bekleyin…</span>
                        </section>
                    ) : <PoolBookingComponent bookings={bookings} />}
                </div>
            </main>

            <footer className="site-footer">
                <div className="page-container footer-inner">
                    <span className="footer-brand"><img src={logo} alt="" /> Eke Park Sitesi</span>
                    <span>© 2026 Abdurrahman Cüce</span>
                </div>
            </footer>
            <Snackbar open={loadError} autoHideDuration={6000} onClose={() => setLoadError(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="error" variant="filled" onClose={() => setLoadError(false)}>
                    Kura sonuçları yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Booking;
