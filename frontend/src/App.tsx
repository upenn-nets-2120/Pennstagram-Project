import './App.css';
import Router from './router';
import ThemeProvider from './providers/ThemeProvider';
import UserProvider from './providers/UserProvider';
import { AuthProvider } from './contexts/AuthContexts';

function App() {
    return (
        <AuthProvider> {/* Wrap AuthProvider */}
            <ThemeProvider>
                <UserProvider>
                    <Router />
                </UserProvider>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App;