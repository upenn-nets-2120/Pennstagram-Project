import './App.css';
import Router from './router';
import ThemeProvider from './providers/ThemeProvider';

function App() {
    return (
        <ThemeProvider>
            <Router />
        </ThemeProvider>
    )
}

export default App;