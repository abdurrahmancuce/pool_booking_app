import Login from './pages/Login';
import Booking from './pages/Booking';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core';

const theme = createTheme({
    palette: {
        primary: {
            main: "#0c3b2e",
            light: "#6d9773",
            contrastText: "#ffba00"
        },
        secondary: {
            main: "#b46617",
            light: "#ffba00",
            contrastText: "#0c3b2e"
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path='/*' element={<Booking />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
