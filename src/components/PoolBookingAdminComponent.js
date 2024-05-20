import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    CircularProgress,
    Container,
    TextField,
} from '@material-ui/core';
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { addPoolBookList } from '../firebase';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(4),
    },
    controls: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        '& > *': {
            marginLeft: theme.spacing(2),
            height: '56px',
            width: '200px'
        },
    },
    tableContainer: {
        marginBottom: theme.spacing(4),
    },
    message: {
        marginTop: theme.spacing(2),
    },
    button: {
        fontWeight: 'bold'
    },
    spinner: {
        marginRight: theme.spacing(2),
    },
}));

const PoolBookingAdminComponent = ({ bookings, setBookings }) => {
    const classes = useStyles();
    const numberOfApartments = 60;
    const sessionsPerDay = 2;
    const aBlockApartments = 12;

    const [startDate, setStartDate] = useState(dayjs(new Date()));
    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [vacationDays, setVacationDays] = useState('0,1,6');

    const generateBookings = () => {
        if (!startDate) {
            alert('Başlangıç tarihini seçiniz.');
            return;
        }

        const newBookings = [];
        let currentDate = new Date(startDate);
        let daysCount = 0;

        const vacationDaysArr = vacationDays.split(',').map(function (el) { 
            return parseInt(el, 10); 
        });

        const aBlockApartmentsArray = Array.from({ length: aBlockApartments }, (_, index) => index + 1);
        const bBlockApartmentsArray = Array.from({ length: numberOfApartments - aBlockApartments }, (_, index) => index + 1);

        while (newBookings.length < numberOfApartments * sessionsPerDay) {
            const sessionDate = new Date(currentDate);
            sessionDate.setDate(currentDate.getDate() + (daysCount / 2));
            sessionDate.setHours(10 + (newBookings.length % sessionsPerDay) * 12);
            sessionDate.setMinutes(0);

            // Tatil günleri kontrolü
            if (vacationDaysArr.includes(sessionDate.getDay())) {
                daysCount++;
                continue;
            }

            let apartmentNumber;
            let block;

            // Random blok seçme
            let randomBlockIndex = 0

            if (aBlockApartmentsArray.length > 0 && bBlockApartmentsArray.length > 0) {
                randomBlockIndex = Math.floor(Math.random() * 2);
            } else if (aBlockApartmentsArray.length > 0 && bBlockApartmentsArray.length === 0) {
                randomBlockIndex = 0;
            } else if (aBlockApartmentsArray.length === 0 && bBlockApartmentsArray.length > 0) {
                randomBlockIndex = 1;
            }

            if (randomBlockIndex === 0) {
                const randomApartmentIndex = Math.floor(Math.random() * aBlockApartmentsArray.length);
                apartmentNumber = aBlockApartmentsArray[randomApartmentIndex];
                aBlockApartmentsArray.splice(randomApartmentIndex, 1);
                block = 'A';
            } else if (randomBlockIndex === 1) {
                const randomApartmentIndex = Math.floor(Math.random() * bBlockApartmentsArray.length);
                apartmentNumber = bBlockApartmentsArray[randomApartmentIndex];
                bBlockApartmentsArray.splice(randomApartmentIndex, 1);
                block = 'B';
            }

            newBookings.push({
                date: sessionDate.toLocaleDateString('tr-TR'),
                apartment: apartmentNumber,
                block: block,
                session: (newBookings.length % sessionsPerDay) + 1,
            });

            if (aBlockApartmentsArray.length === 0 && bBlockApartmentsArray.length === 0) {
                break; // Tüm daireler kullanıldı
            }

            daysCount++;
        }

        newBookings.sort((a, b) => {
            if (a.block !== b.block) {
                return a.block.localeCompare(b.block); // Daire numarası aynı ise blok ismine göre sırala
            }
            return a.apartment - b.apartment; // Daire numarasına göre sırala
        });

        setBookings(newBookings);
        setIsReady(true);
    };

    const publishList = async () => {
        console.log(bookings)
        setLoading(true);
        await addPoolBookList(bookings)
        setLoading(false);
        setIsReady(false);
    }

    return (
        <Container className={classes.root}>
            <div className={classes.controls}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        className={classes.input}
                        label="Başlangıç Tarihi"
                        name="date"
                        value={startDate}
                        format="DD/MM/YYYY"
                        onChange={(newValue) => setStartDate(newValue)} />
                </LocalizationProvider>
                <TextField 
                    variant="outlined"
                    label="Tatil Günleri"
                    value={vacationDays}
                    onChange={(event) => setVacationDays(event.target.value.replace(' ', ''))}
                    helperText="',' ile ayırarak tatil günlerini belirtiniz. (0=Pazar)"
                />
                <Button variant="contained" color='primary' className={classes.button} onClick={generateBookings}>
                    Kura Çek
                </Button>
                {bookings?.data?.length > 0 && <Button disabled={loading || !isReady} variant="contained" color='secondary' className={classes.button} onClick={publishList}>
                    {loading && (
                        <CircularProgress size={24} className={classes.spinner} />
                    )}
                    Yayınla
                </Button>}
            </div>
        </Container>
    );
};

export default PoolBookingAdminComponent;
