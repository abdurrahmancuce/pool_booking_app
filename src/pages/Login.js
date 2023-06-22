import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    TextField,
    Button,
    Container,
    Typography,
    Paper,
    CircularProgress,
} from '@material-ui/core';
import { signIn } from '../firebase';
import { AccountCircle } from "@mui/icons-material";
import '../App.css'
import logo from '../logo.svg';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    paper: {
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        fontSize: '100px !important',
        color: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        fontWeight: 'bold'
    },
    spinner: {
        marginRight: theme.spacing(2),
    },
    error: {
        color: theme.palette.error.main,
        marginBottom: theme.spacing(2),
        textAlign: 'center',
    },
}));

const Login = () => {
    const classes = useStyles();
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const userCredential = await signIn(email, password);
            setLoading(false);
            localStorage.setItem('userCredential', JSON.stringify(userCredential));
            navigate("/booking");
        } catch (error) {
            setLoading(false);
            setError(error);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className={classes.root}>
            <img src={logo} className="App-logo" alt="logo" />
            <Paper elevation={3} className={classes.paper}>
                <AccountCircle className={classes.avatar} />
                <Typography color='secondary' variant="h6" gutterBottom>
                    Giriş Ekranı
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="E-posta"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Şifre"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color='primary'
                        className={classes.submit}
                        disabled={loading}
                    >
                        {loading && (
                            <CircularProgress size={24} className={classes.spinner} />
                        )}
                        Giriş Yap
                    </Button>
                    {error && <Typography className={classes.error}>{error}</Typography>}
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
