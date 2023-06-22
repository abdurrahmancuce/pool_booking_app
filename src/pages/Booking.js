import { Button, makeStyles } from '@material-ui/core';
import PoolBookingComponent from '../components/PoolBookingComponent';
import PoolBookingAdminComponent from '../components/PoolBookingAdminComponent';
import { useEffect, useState } from 'react';
import '../App.css'
import logo from '../logo.svg';
import { CircularProgress, Paper, Stack, styled } from '@mui/material';
import { getLastPoolBookList } from '../firebase';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: theme.spacing(4),
    },
    logo: {
        height: '100px',
    },
    buttons: {
        position: 'absolute',
        top: 20,
        right: 20
    }
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.secondary.main,
}));

function Booking() {
    const classes = useStyles();
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([]);
    const [userCredential, setUserCredential] = useState({})
    const [loading, setLoading] = useState([true]);

    useEffect(() => {
        const credential = JSON.parse(localStorage.getItem('userCredential'));
        setUserCredential(credential);

        getPoolBookList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getPoolBookList = async () => {
        setLoading(true)
        const poolBookList = await getLastPoolBookList()
        setBookings(poolBookList)
        setLoading(false)
    };

    const setBookingsCallback = (data) => {
        setBookings({
            createdAt: Date.now(),
            data
        })
    }

    const logout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <div className={classes.root}>
            <Stack spacing={2} width={'96%'}>
                <div className={classes.buttons}>
                    {userCredential ? <Button variant="outlined" color='secondary' className={classes.button} onClick={logout}>
                            Çıkış Yap
                        </Button> :
                        <Button variant="outlined" color='secondary' className={classes.button} onClick={() => { navigate('/login') }}>
                            Giriş Yap
                        </Button>
                    }
                </div>
                <img src={logo} className={classes.logo} alt="logo" />
                {userCredential && <Item>
                    <PoolBookingAdminComponent bookings={bookings} setBookings={setBookingsCallback} />
                </Item>}
                <Item>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <PoolBookingComponent bookings={bookings} />
                    )}
                </Item>
            </Stack>

        </div>
    );
}

export default Booking;
