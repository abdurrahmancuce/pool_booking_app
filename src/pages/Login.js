import React, { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { ArrowBack, LockOutlined, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { signIn } from '../firebase';
import logo from '../logo.svg';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userCredential = await signIn(email, password);
            setLoading(false);
            localStorage.setItem('userCredential', JSON.stringify(userCredential));
            navigate('/booking');
        } catch (error) {
            setLoading(false);
            setError(error);
        }
    };

    return (
        <main className="login-page">
            <section className="login-visual">
                <button className="brand brand-light" type="button" onClick={() => navigate('/')}>
                    <span className="brand-mark"><img src={logo} alt="" /></span>
                    <span><strong className="brand-name">Eke Park Sitesi</strong><small>HAVUZ KURASI</small></span>
                </button>
                <div className="login-visual-content">
                    <span className="login-kicker">Yönetim paneli</span>
                    <h1>Havuz planını<br />kolayca yönetin.</h1>
                    <p>Kura çekimini hazırlayın, kontrol edin ve tek adımda site sakinleriyle paylaşın.</p>
                    <div className="visual-badge">
                        <span><LockOutlined /></span>
                        <div><strong>Güvenli erişim</strong><small>Yalnızca yetkili yöneticiler</small></div>
                    </div>
                </div>
                <div className="login-wave login-wave-one" />
                <div className="login-wave login-wave-two" />
            </section>

            <section className="login-form-side">
                <button className="back-link" type="button" onClick={() => navigate('/')}><ArrowBack /> Sonuçlara dön</button>
                <div className="login-form-wrap">
                    <div className="mobile-login-brand"><img src={logo} alt="Eke Park Sitesi" /></div>
                    <span className="form-kicker">Tekrar hoş geldiniz</span>
                    <h2>Yönetici girişi</h2>
                    <p className="form-intro">Kura yönetim alanına erişmek için bilgilerinizi girin.</p>
                    <form onSubmit={handleSubmit}>
                        <label className="form-field">
                            <span>E-posta adresi</span>
                            <input required type="email" name="email" autoComplete="email" placeholder="ornek@site.com" value={email} onChange={(event) => setEmail(event.target.value)} />
                        </label>
                        <label className="form-field">
                            <span>Şifre</span>
                            <div className="password-field">
                                <input required type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="Şifrenizi girin" value={password} onChange={(event) => setPassword(event.target.value)} />
                                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}>
                                    {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                </button>
                            </div>
                        </label>
                        {error && <div className="login-error" role="alert">{String(error)}</div>}
                        <button className="primary-action login-submit" type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={22} color="inherit" /> : <LockOutlined />}
                            {loading ? 'Giriş yapılıyor…' : 'Giriş yap'}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Login;
