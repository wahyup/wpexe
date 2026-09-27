import './globals.css';
import RegisterSW from './components/RegisterSW';

export const metadata = {
  title: 'WP.EXE Geomap Overlay Generator',
  description: 'Tambahkan watermark overlay lokasi, koordinat, thumbnail, dan timestamp pada foto Anda.',
  manifest: '/manifest.json',
  applicationName: 'WP.EXE Geomap',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WP.EXE Geomap',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport = {
  themeColor: '#111111',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
