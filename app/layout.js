import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Bracketed — Esports Tournament Platform',
  description: 'Run and compete in esports tournaments: registration, brackets, and results in one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
