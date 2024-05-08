import './App.css';
import Router from './router';
import ThemeProvider from './providers/ThemeProvider';
import UserProvider from './providers/UserProvider';

function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <Router />
            </UserProvider>
        </ThemeProvider>
    )
}

export default App;