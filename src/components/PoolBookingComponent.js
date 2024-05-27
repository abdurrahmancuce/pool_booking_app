import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
    Typography,
    Paper,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        color: '#B36617'
    },
    table: {
        minWidth: 650,
    },
    tableHeader: {
        backgroundColor: theme.palette.primary.main,
        "& > *": {
            color: theme.palette.secondary.light,
            fontWeight: "bold",
        },
    },
}));

const PoolBookingComponent = ({ bookings }) => {
    const classes = useStyles();

    const getDateFromTimestamp = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleString('tr-TR')
    }

    return (
        <Container className={classes.root}>
            {bookings?.data?.length > 0 ? (
                <>
                    <Typography color='secondary' variant="h6" gutterBottom>
                        <b>Not:</b> Pazartesi günleri havuz kapalıdır.
                        Cumartesi, Pazar aile günü yoktur.
                    </Typography>
                    <Typography color='secondary' variant="h6" gutterBottom>
                        <b>Kura Tarihi -</b> {getDateFromTimestamp(bookings.createdAt)}
                    </Typography>
                    <TableContainer className={classes.tableContainer} component={Paper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow className={classes.tableHeader}>
                                    <TableCell>Blok</TableCell>
                                    <TableCell>Daire No</TableCell>
                                    <TableCell>Tarih</TableCell>
                                    <TableCell>Seans</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.data.map((booking, index) => (
                                    <TableRow key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                        <TableCell>{booking.block}</TableCell>
                                        <TableCell>Daire {booking.apartment}</TableCell>
                                        <TableCell>{booking.date}</TableCell>
                                        <TableCell>{booking.session === 1 ? '18:00 - 20:00' : '20:00 - 22:00'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : (
                <Typography variant="h5" className={classes.message}>
                    Kura henüz çekilmemiştir...
                </Typography>
            )}
        </Container>
    );
};

export default PoolBookingComponent;
