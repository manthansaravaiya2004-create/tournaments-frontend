import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import AppShell from '../components/AppShell';
import GlobalNotificationListener from '../components/GlobalNotificationListener';

export const metadata = {
  title: 'Bracketed — Esports Tournament Platform',
  description: 'Run and compete in esports tournaments: registration, brackets, and results in one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <GlobalNotificationListener />
            <AppShell>
              {children}
            </AppShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
