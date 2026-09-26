# Geomap Overlay Generator

Aplikasi Next.js untuk menambahkan watermark overlay lokasi, koordinat, thumbnail peta,
dan timestamp pada foto (mirip aplikasi "GPS Map Camera").

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Deploy ke Vercel

**Opsi A — Vercel CLI (tercepat)**
```bash
npm install -g vercel
vercel
```
Ikuti instruksi di terminal (login, pilih scope, terima setting default). Vercel akan
otomatis mendeteksi ini sebagai project Next.js.

**Opsi B — Lewat GitHub**
1. Push folder ini ke repository GitHub baru.
2. Buka https://vercel.com/new, pilih repo tersebut.
3. Vercel otomatis mendeteksi framework "Next.js" — biarkan setting default, klik Deploy.

Tidak ada environment variable yang wajib diisi untuk versi ini.

## Catatan

- Komponen utama ada di `app/components/GeomapOverlayGenerator.jsx` (client component).
- Fitur "Ambil Lokasi Saya (GPS)" memakai Geolocation API browser + reverse-geocoding
  gratis dari Nominatim (OpenStreetMap) — butuh izin lokasi dari pengguna saat dibuka
  di browser (HTTPS, yang otomatis dipenuhi oleh domain Vercel).
- Tombol "Simpan & Download Gambar" mengekspor kanvas menjadi PNG resolusi penuh
  (bug pada file asli, di mana tombol download memakai variabel yang belum
  didefinisikan, sudah diperbaiki di sini).
