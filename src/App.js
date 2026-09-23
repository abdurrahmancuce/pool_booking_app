import Login from './pages/Login';
import Booking from './pages/Booking';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core';

const theme = createTheme({
    palette: {
        primary: {
            main: "#167ca5",
            light: "#22a9af",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#ff7c5f",
            light: "#ffa08a",
            contrastText: "#ffffff"
        },
    },
    typography: {
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
