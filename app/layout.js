import './globals.css';

export const metadata = {
  title: 'WP.EXE Geomap Overlay Generator',
  description: 'Tambahkan watermark overlay lokasi, koordinat, thumbnail, dan timestamp pada foto Anda.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
