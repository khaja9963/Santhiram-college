import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import AppLayoutWrapper from '@/components/layout/AppLayoutWrapper';

export const metadata: Metadata = {
  title: 'SREC Smart Campus | Santhiram Engineering College (Autonomous), Nandyal',
  description:
    "Official next-generation smart campus ecosystem for Santhiram Engineering College (Autonomous), Nandyal, Andhra Pradesh. Accredited with NAAC 'A' Grade and NBA. Empowering Innovation, Engineering Excellence & Future Leaders.",
  keywords: [
    'SREC Nandyal',
    'Santhiram Engineering College',
    'SREC Smart Campus',
    'Autonomous Engineering College Nandyal',
    'AP EAPCET SREC',
    'Engineering Admissions Kurnool Nandyal',
  ],
  authors: [{ name: 'SREC Smart Campus Team' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/images/srec_logo.png',
  },
  openGraph: {
    title: 'Santhiram Engineering College — SREC Smart Campus',
    description: 'Empowering Innovation, Engineering Excellence & Future Leaders at SREC Nandyal.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-amber-400 selection:text-slate-900">
        <AuthProvider>
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
