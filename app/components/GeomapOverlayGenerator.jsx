'use client';

import React, { useState, useEffect, useRef } from 'react';

// SVG Icons for clean, zero-dependency rendering
const CameraIcon = () => (
  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-emerald-400 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-emerald-400 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// Helper function to convert HEX color to RGBA
const hexToRgba = (hex, alpha) => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
};

// Helper function to format date into Indonesian standard format
const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Default sample SVG pattern for initial image state
const createSampleImage = (text, bg, fg) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 1200, 800);
  grad.addColorStop(0, bg || '#1e293b');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 800);

  // Grid pattern
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 1200; i += 40) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 800); ctx.stroke();
  }
  for (let j = 0; j < 800; j += 40) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(1200, j); ctx.stroke();
  }

  // Text
  ctx.fillStyle = fg || '#94a3b8';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, 600, 400);

  return canvas.toDataURL();
};

export default function GeomapOverlayGenerator() {
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().split(' ')[0]; // HH:mm:ss (dengan detik)

  const [mainImage, setMainImage] = useState(null);
  const [thumbImage, setThumbImage] = useState(null);
  const [title, setTitle] = useState('GUDANG LINI III PESAWARAN');
  const [address, setAddress] = useState('Tamansari, Kec. Gedong Tataan, Kabupaten Pesawaran, Lampung 35366');
  const [coordinates, setCoordinates] = useState('-5.365792, 105.145480 (78m Alt)');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [timezone, setTimezone] = useState('WIB'); // 'WIB', 'WITA', 'WIT', 'UTC'

  // Overlay Layout & Styling States
  const [overlayPosition, setOverlayPosition] = useState('bottom-left'); // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
  const [themeColor, setThemeColor] = useState('dark'); // 'dark', 'light', 'amber', 'red', 'emerald', 'cyber', 'blueprint', 'glass', 'custom'
  const [overlayScale, setOverlayScale] = useState(205); // Overlay manual scale (50% - 250%)
  const [cardOpacity, setCardOpacity] = useState(85); // Card Opacity (20% - 100%)
  const [cardRadius, setCardRadius] = useState(12); // Corner radius (0 - 24)

  // Custom theme color pickers
  const [customBgColor, setCustomBgColor] = useState('#0f172a');
  const [customTextColor, setCustomTextColor] = useState('#ffffff');
  const [customAccentColor, setCustomAccentColor] = useState('#38bdf8');

  const [isLocating, setIsLocating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  useEffect(() => {
    setMainImage(createSampleImage('Pilih / Ambil Foto Utama', '#1e293b', '#cbd5e1'));
    setThumbImage('/peta-default.jpg'); // Thumbnail peta default
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocator tidak didukung oleh browser ini.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const alt = pos.coords.altitude ? `${Math.round(pos.coords.altitude)}m Alt` : '±10m';
        setCoordinates(`${lat}, ${lng} (${alt})`);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        } catch (e) {
          console.error('Gagal mendapatkan nama alamat dari koordinat:', e);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Gagal mendapatkan lokasi:', err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageChange = (e, target) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (target === 'main') setMainImage(event.target.result);
        if (target === 'thumb') setThumbImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCanvas = async () => {
    if (!mainImage || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Load Main Image
    const imgMain = new Image();
    imgMain.crossOrigin = 'anonymous';
    imgMain.src = mainImage;

    await new Promise((resolve) => {
      imgMain.onload = resolve;
    });

    // Set high-res canvas size based on main photo natural aspect ratio
    canvas.width = imgMain.naturalWidth || 1200;
    canvas.height = imgMain.naturalHeight || 800;

    // 1. Draw Main Background Image
    ctx.drawImage(imgMain, 0, 0, canvas.width, canvas.height);

    // Load Thumbnail Image
    let imgThumb = null;
    if (thumbImage) {
      imgThumb = new Image();
      imgThumb.crossOrigin = 'anonymous';
      imgThumb.src = thumbImage;
      await new Promise((resolve) => {
        imgThumb.onload = resolve;
        imgThumb.onerror = resolve;
      });
    }

    // Dynamic overlay size scaling based on main canvas dimensions & user scale slider
    const scale = (canvas.width / 1200) * (overlayScale / 100);
    const padding = 24 * scale;
    const overlayWidth = Math.min(canvas.width * 0.95, 540 * scale);
    const thumbSize = 110 * scale;
    const cardPadding = 16 * scale;
    const alphaVal = cardOpacity / 100;

    // Calculate position
    let x = padding;
    if (overlayPosition.includes('right')) {
      x = canvas.width - overlayWidth - padding;
    }

    const cardHeight = Math.max(thumbSize + cardPadding * 2, 130 * scale);
    let y = canvas.height - cardHeight - padding;
    if (overlayPosition.includes('top')) {
      y = padding;
    }

    // Determine Theme Color Styles
    let bgStyle, borderStyle, accentColor, textColorPrimary, textColorSecondary;

    switch (themeColor) {
      case 'light':
        bgStyle = `rgba(255, 255, 255, ${alphaVal})`;
        borderStyle = 'rgba(0, 0, 0, 0.15)';
        accentColor = '#0284c7'; // Sky Blue
        textColorPrimary = '#0f172a';
        textColorSecondary = '#334155';
        break;

      case 'amber':
        bgStyle = `rgba(24, 24, 27, ${alphaVal})`;
        borderStyle = 'rgba(245, 158, 11, 0.8)';
        accentColor = '#f59e0b'; // Amber
        textColorPrimary = '#ffffff';
        textColorSecondary = '#e4e4e7';
        break;

      case 'red':
        bgStyle = `rgba(69, 10, 10, ${alphaVal})`;
        borderStyle = 'rgba(239, 68, 68, 0.8)';
        accentColor = '#f87171'; // Red
        textColorPrimary = '#ffffff';
        textColorSecondary = '#fca5a5';
        break;

      case 'emerald':
        bgStyle = `rgba(6, 78, 59, ${alphaVal})`;
        borderStyle = 'rgba(16, 185, 129, 0.8)';
        accentColor = '#34d399'; // Emerald
        textColorPrimary = '#ffffff';
        textColorSecondary = '#a7f3d0';
        break;

      case 'cyber':
        bgStyle = `rgba(15, 7, 32, ${alphaVal})`;
        borderStyle = 'rgba(236, 72, 153, 0.8)';
        accentColor = '#06b6d4'; // Cyan Accent
        textColorPrimary = '#f472b6'; // Neon Pink Title
        textColorSecondary = '#e0e7ff';
        break;

      case 'blueprint':
        bgStyle = `rgba(10, 37, 64, ${alphaVal})`;
        borderStyle = 'rgba(56, 189, 248, 0.7)';
        accentColor = '#38bdf8'; // Sky Blue Accent
        textColorPrimary = '#ffffff';
        textColorSecondary = '#bae6fd';
        break;

      case 'glass':
        bgStyle = `rgba(255, 255, 255, ${Math.min(alphaVal, 0.35)})`;
        borderStyle = 'rgba(255, 255, 255, 0.4)';
        accentColor = '#ffffff';
        textColorPrimary = '#ffffff';
        textColorSecondary = '#f1f5f9';
        break;

      case 'custom':
        bgStyle = hexToRgba(customBgColor, alphaVal);
        borderStyle = customAccentColor;
        accentColor = customAccentColor;
        textColorPrimary = customTextColor;
        textColorSecondary = customTextColor;
        break;

      case 'dark':
      default:
        bgStyle = `rgba(15, 23, 42, ${alphaVal})`;
        borderStyle = 'rgba(255, 255, 255, 0.2)';
        accentColor = '#34d399'; // Mint Green
        textColorPrimary = '#ffffff';
        textColorSecondary = '#cbd5e1';
        break;
    }

    // 2. Draw Card Container with Glassmorphism / Solid Theme Background
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, overlayWidth, cardHeight, cardRadius * scale);

    ctx.fillStyle = bgStyle;
    ctx.strokeStyle = borderStyle;

    ctx.fill();
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Accent Bar on Top of Overlay Card
    ctx.beginPath();
    ctx.lineWidth = 4 * scale;
    ctx.strokeStyle = accentColor;
    ctx.moveTo(x + (cardRadius + 2) * scale, y);
    ctx.lineTo(x + overlayWidth - (cardRadius + 2) * scale, y);
    ctx.stroke();

    // 3. Draw Thumbnail Picture
    const thumbX = x + cardPadding;
    const thumbY = y + cardPadding;

    if (imgThumb && imgThumb.complete && imgThumb.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(thumbX, thumbY, thumbSize, thumbSize, Math.max(4, cardRadius - 4) * scale);
      ctx.clip();
      ctx.drawImage(imgThumb, thumbX, thumbY, thumbSize, thumbSize);
      ctx.restore();

      // Border for thumbnail
      ctx.beginPath();
      ctx.roundRect(thumbX, thumbY, thumbSize, thumbSize, Math.max(4, cardRadius - 4) * scale);
      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = accentColor;
      ctx.stroke();
    }

    // 4. Draw Overlay Text Stack
    const textX = imgThumb ? thumbX + thumbSize + (14 * scale) : x + cardPadding;
    const maxTextWidth = overlayWidth - (textX - x) - cardPadding;

    // Title
    ctx.fillStyle = accentColor;
    ctx.font = `bold ${Math.round(16 * scale)}px Inter, sans-serif`;
    ctx.fillText(title.toUpperCase(), textX, y + cardPadding + (14 * scale));

    // Address Multi-line Text Wrapping
    ctx.fillStyle = textColorPrimary;
    ctx.font = `${Math.round(12 * scale)}px Inter, sans-serif`;

    const words = address.split(' ');
    let line = '';
    let currentY = y + cardPadding + (32 * scale);
    const lineHeight = 15 * scale;
    let linesDrawn = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && n > 0) {
        if (linesDrawn < 2) {
          ctx.fillText(line, textX, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
          linesDrawn++;
        } else {
          ctx.fillText(line.trim() + '...', textX, currentY);
          line = '';
          break;
        }
      } else {
        line = testLine;
      }
    }
    if (line && linesDrawn < 2) {
      ctx.fillText(line, textX, currentY);
      currentY += lineHeight;
    }

    // Coordinates & GPS Info
    if (coordinates) {
      ctx.fillStyle = textColorSecondary;
      ctx.font = `${Math.round(11 * scale)}px Inter, monospace`;
      ctx.fillText(`GPS: ${coordinates}`, textX, currentY + (2 * scale));
      currentY += lineHeight;
    }

    // Date & Time (Formatted to Indonesian Standard)
    ctx.fillStyle = accentColor;
    ctx.font = `500 ${Math.round(11 * scale)}px Inter, sans-serif`;
    const formattedIndoDate = formatIndonesianDate(date);
    const formattedDateTime = `${formattedIndoDate} • ${time} ${timezone}`;
    ctx.fillText(`WAKTU: ${formattedDateTime}`, textX, currentY + (2 * scale));

    ctx.restore();
    setIsProcessing(false);
  };

  useEffect(() => {
    renderCanvas();
  }, [
    mainImage, thumbImage, title, address, coordinates, date, time, timezone,
    overlayPosition, themeColor, overlayScale, cardOpacity, cardRadius,
    customBgColor, customTextColor, customAccentColor,
  ]);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const targetBytes = 2 * 1024 * 1024; // ~2 MB
    const toBlob = (quality) =>
      new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));

    // Cari kualitas JPEG tertinggi yang masih menghasilkan file <= ~2 MB
    let quality = 0.92;
    let blob = await toBlob(quality);
    let steps = 0;
    while (blob && blob.size > targetBytes && quality > 0.35 && steps < 12) {
      quality -= 0.07;
      blob = await toBlob(quality);
      steps += 1;
    }

    if (!blob) {
      setIsProcessing(false);
      return;
    }

    const safeTitle = (title || 'geomap-overlay').trim().replace(/\s+/g, '-').toLowerCase();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${safeTitle}-${date}.jpg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col items-center justify-center text-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500">
            WP.EXE GEOMAP
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            
          </p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Control Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl h-fit">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center border-b border-slate-800 pb-3">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span> Panel Pengaturan Overlay
          </h2>

          {/* 1. Main Photo Picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">1. Foto Utama</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition text-center flex items-center justify-center cursor-pointer"
              >
                <UploadIcon /> Upload File
              </button>
              <label className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition text-center flex items-center justify-center cursor-pointer">
                <CameraIcon /> Kamera
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, 'main')}
                />
              </label>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, 'main')}
            />
          </div>

          {/* 2. Thumbnail Photo Picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">2. Foto Thumbnail (Map / Lokasi Sekunder)</label>
            <button
              type="button"
              onClick={() => thumbInputRef.current?.click()}
              className="w-full p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition flex items-center justify-center cursor-pointer"
            >
              <UploadIcon /> Pilih Gambar Thumbnail
            </button>
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, 'thumb')}
            />
          </div>

          {/* 3. Title Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">3. Judul / Nama Proyek</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Survey Lokasi Lapangan"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* 4. Address Input & GPS Auto Button */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-slate-300">4. Alamat & GPS</label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="text-xs text-emerald-400 hover:underline flex items-center cursor-pointer"
              >
                <MapPinIcon /> {isLocating ? 'Deteksi...' : 'Ambil Lokasi Saya (GPS)'}
              </button>
            </div>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition mb-2"
            />
            <input
              type="text"
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
              placeholder="Koordinat (contoh: -6.2088, 106.8456)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* 5. Date & Time Picker */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1 flex items-center">
                <CalendarIcon /> Tanggal (Format Indonesia)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
              />
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                Hasil: {formatIndonesianDate(date)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Jam & Detik</label>
                <input
                  type="time"
                  step="1"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Zona</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                >
                  <option value="WIB">WIB</option>
                  <option value="WITA">WITA</option>
                  <option value="WIT">WIT</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Styling & Theme Options Section */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider">
              🎨 Tema & Desain Overlay
            </h3>

            {/* Select Theme Preset */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pilih Tema Overlay
              </label>
              <select
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="dark">🌙 Dark Modern (Slate Gelap)</option>
                <option value="light">☀️ Light Clean (Putih Minimalis)</option>
                <option value="amber">⚠️ Amber Caution (Kuning Lapangan)</option>
                <option value="red">🚨 Emergency Red (Merah Siaga)</option>
                <option value="emerald">🌿 Field Emerald (Hijau Survey)</option>
                <option value="cyber">⚡ Cyber Neon (Futuristik Pink/Cyan)</option>
                <option value="blueprint">📐 Technical Blueprint (Biru Teknik)</option>
                <option value="glass">❄️ Frost Glass (Transparan Frost)</option>
                <option value="custom">⚙️ Kustomisasi Warna Manual (Custom)</option>
              </select>
            </div>

            {/* Custom Theme Color Pickers (Visible when 'custom' theme selected) */}
            {themeColor === 'custom' && (
              <div className="p-3 bg-slate-950 border border-teal-500/30 rounded-xl space-y-3 animate-fadeIn">
                <p className="text-[11px] text-teal-300 font-medium">Pilih Kombinasi Warna Manual:</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Background</label>
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                      <input
                        type="color"
                        value={customBgColor}
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] font-mono">{customBgColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Teks Alamat</label>
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                      <input
                        type="color"
                        value={customTextColor}
                        onChange={(e) => setCustomTextColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] font-mono">{customTextColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Aksen / Judul</label>
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                      <input
                        type="color"
                        value={customAccentColor}
                        onChange={(e) => setCustomAccentColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] font-mono">{customAccentColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Position Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Posisi Overlay</label>
              <select
                value={overlayPosition}
                onChange={(e) => setOverlayPosition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="bottom-left">↙️ Kiri Bawah</option>
                <option value="bottom-right">↘️ Kanan Bawah</option>
                <option value="top-left">↖️ Kiri Atas</option>
                <option value="top-right">↗️ Kanan Atas</option>
              </select>
            </div>

            {/* Scale Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Ukuran Scale ({overlayScale}%)</label>
                <button
                  type="button"
                  onClick={() => setOverlayScale(205)}
                  className="text-[10px] text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                >
                  Reset (205%)
                </button>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="5"
                value={overlayScale}
                onChange={(e) => setOverlayScale(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Opacity Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Kejelasan / Transparansi ({cardOpacity}%)</label>
                <span className="text-[10px] text-slate-400">{cardOpacity < 50 ? 'Transparan' : 'Pekat'}</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={cardOpacity}
                onChange={(e) => setCardOpacity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>

            {/* Corner Radius Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Sudut Kelengkungan ({cardRadius}px)</label>
                <span className="text-[10px] text-slate-400">{cardRadius === 0 ? 'Kotak' : 'Bulat'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="2"
                value={cardRadius}
                onChange={(e) => setCardRadius(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

          </div>

        </div>

        {/* Right Column: Live Interactive Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center sticky top-6">
            <div className="w-full flex justify-between items-center mb-3 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping mr-2"></span> Preview Canvas Stamping
              </span>
              <span className="text-xs text-slate-500 font-mono">High Resolution Output</span>
            </div>

            {/* Canvas Container */}
            <div className="w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 flex justify-center items-center p-2 min-h-[320px]">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded-lg shadow-2xl object-contain max-h-[72vh]"
              />
            </div>

            {/* Main Download Button */}
            <div className="w-full mt-4">
              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-bold text-white rounded-xl shadow-lg shadow-emerald-950/50 transition duration-200 flex items-center justify-center active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <DownloadIcon /> Simpan & Download Gambar
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
