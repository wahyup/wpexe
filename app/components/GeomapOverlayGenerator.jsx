'use client';

import React, { useState, useEffect, useRef } from 'react';

import AnimatedTitle from './AnimatedTitle'; // sesuaikan path


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

const SettingsIcon = () => (
  <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Preset tema untuk menu Setting (warna swatch hanya untuk pratinjau tombol)
const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark Modern', bg: '#0f172a', accent: '#34d399' },
  { value: 'light', label: 'Light Clean', bg: '#ffffff', accent: '#0284c7' },
  { value: 'amber', label: 'Amber Caution', bg: '#18181b', accent: '#f59e0b' },
  { value: 'red', label: 'Emergency Red', bg: '#450a0a', accent: '#f87171' },
  { value: 'emerald', label: 'Field Emerald', bg: '#064e3b', accent: '#34d399' },
  { value: 'cyber', label: 'Cyber Neon', bg: '#0f0720', accent: '#06b6d4' },
  { value: 'blueprint', label: 'Blueprint', bg: '#0a2540', accent: '#38bdf8' },
  { value: 'glass', label: 'Frost Glass', bg: '#64748b', accent: '#ffffff' },
];

const POSITION_OPTIONS = [
  { value: 'top-left', label: '↖ Kiri Atas' },
  { value: 'top-right', label: '↗ Kanan Atas' },
  { value: 'bottom-left', label: '↙ Kiri Bawah' },
  { value: 'bottom-right', label: '↘ Kanan Bawah' },
];

const SETTINGS_KEY = 'geomap-overlay-settings-v1';
const DEFAULT_SETTINGS = {
  overlayPosition: 'bottom-left',
  themeColor: 'dark',
  overlayScale: 205,
  cardOpacity: 85,
  cardRadius: 12,
  customBgColor: '#0f172a',
  customTextColor: '#ffffff',
  customAccentColor: '#38bdf8',
  showThumb: true,
  thumbSize: 110,
  thumbShape: 'rounded', // 'rounded' | 'square' | 'circle'
  thumbFit: 'cover', // 'cover' | 'contain'
};

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

  // Menu Setting (tema & slide)
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('tema'); // 'tema' | 'slide'
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Custom thumbnail
  const [showThumb, setShowThumb] = useState(DEFAULT_SETTINGS.showThumb);
  const [thumbSizeSetting, setThumbSizeSetting] = useState(DEFAULT_SETTINGS.thumbSize);
  const [thumbShape, setThumbShape] = useState(DEFAULT_SETTINGS.thumbShape);
  const [thumbFit, setThumbFit] = useState(DEFAULT_SETTINGS.thumbFit);

  const [isLocating, setIsLocating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  useEffect(() => {
    setMainImage(createSampleImage('Pilih / Ambil Foto Utama', '#1e293b', '#cbd5e1'));
    setThumbImage('/peta-default.jpg'); // Thumbnail peta default
  }, []);

  // Muat setting yang tersimpan di perangkat
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const saved = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
        setOverlayPosition(saved.overlayPosition);
        setThemeColor(saved.themeColor);
        setOverlayScale(Number(saved.overlayScale));
        setCardOpacity(Number(saved.cardOpacity));
        setCardRadius(Number(saved.cardRadius));
        setCustomBgColor(saved.customBgColor);
        setCustomTextColor(saved.customTextColor);
        setCustomAccentColor(saved.customAccentColor);
        setShowThumb(Boolean(saved.showThumb));
        setThumbSizeSetting(Number(saved.thumbSize));
        setThumbShape(saved.thumbShape);
        setThumbFit(saved.thumbFit);
      }
    } catch (e) {
      console.warn('Gagal memuat setting:', e);
    }
    setSettingsLoaded(true);
  }, []);

  // Simpan setiap perubahan setting
  useEffect(() => {
    if (!settingsLoaded) return;
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          showThumb, thumbSize: thumbSizeSetting, thumbShape, thumbFit,
          overlayPosition, themeColor, overlayScale, cardOpacity, cardRadius,
          customBgColor, customTextColor, customAccentColor,
        })
      );
    } catch (e) {
      console.warn('Gagal menyimpan setting:', e);
    }
  }, [
    settingsLoaded, overlayPosition, themeColor, overlayScale, cardOpacity, cardRadius,
    showThumb, thumbSizeSetting, thumbShape, thumbFit,
    customBgColor, customTextColor, customAccentColor,
  ]);

  const handleResetSettings = () => {
    setOverlayPosition(DEFAULT_SETTINGS.overlayPosition);
    setThemeColor(DEFAULT_SETTINGS.themeColor);
    setOverlayScale(DEFAULT_SETTINGS.overlayScale);
    setCardOpacity(DEFAULT_SETTINGS.cardOpacity);
    setCardRadius(DEFAULT_SETTINGS.cardRadius);
    setCustomBgColor(DEFAULT_SETTINGS.customBgColor);
    setCustomTextColor(DEFAULT_SETTINGS.customTextColor);
    setCustomAccentColor(DEFAULT_SETTINGS.customAccentColor);
    setShowThumb(DEFAULT_SETTINGS.showThumb);
    setThumbSizeSetting(DEFAULT_SETTINGS.thumbSize);
    setThumbShape(DEFAULT_SETTINGS.thumbShape);
    setThumbFit(DEFAULT_SETTINGS.thumbFit);
  };

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
    if (thumbImage && showThumb) {
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
    const thumbSize = (showThumb ? thumbSizeSetting : 0) * scale;
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

    const drawThumb = !!(imgThumb && imgThumb.complete && imgThumb.naturalWidth > 0);
    if (drawThumb) {
      const thumbR =
        thumbShape === 'circle' ? thumbSize / 2
        : thumbShape === 'square' ? 0
        : Math.max(4, cardRadius - 4) * scale;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(thumbX, thumbY, thumbSize, thumbSize, thumbR);
      ctx.clip();

      const iw = imgThumb.naturalWidth;
      const ih = imgThumb.naturalHeight;
      if (thumbFit === 'contain') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
        const ratio = Math.min(thumbSize / iw, thumbSize / ih);
        const dw = iw * ratio;
        const dh = ih * ratio;
        ctx.drawImage(imgThumb, thumbX + (thumbSize - dw) / 2, thumbY + (thumbSize - dh) / 2, dw, dh);
      } else {
        // Crop tengah supaya gambar tidak gepeng
        const side = Math.min(iw, ih);
        ctx.drawImage(imgThumb, (iw - side) / 2, (ih - side) / 2, side, side, thumbX, thumbY, thumbSize, thumbSize);
      }
      ctx.restore();

      // Border for thumbnail
      ctx.beginPath();
      ctx.roundRect(thumbX, thumbY, thumbSize, thumbSize, thumbR);
      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = accentColor;
      ctx.stroke();
    }

    // 4. Draw Overlay Text Stack
    const textX = drawThumb ? thumbX + thumbSize + (14 * scale) : x + cardPadding;
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
    showThumb, thumbSizeSetting, thumbShape, thumbFit,
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
          <img
          src="/maskable-512x512.png"
          alt="Logo WP.EXE Geomap Generator"
          className="w-16 h-16 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-lg shadow-emerald-950/50 shrink-0"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500">
            WP.EXE GEOCAM
          </h1>
          <AnimatedTitle
  text="Minimal Push Rank !!!"
  className="text-sm font-extrabold"
/>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Control Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-emerald-400 flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span> Panel Overlay
            </h2>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition flex items-center cursor-pointer"
            >
              <SettingsIcon /> Setting
            </button>
          </div>

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

          {/* Ringkasan setting aktif + tombol buka menu Setting */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl transition flex items-center justify-between cursor-pointer text-left"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-200">Tema & Ukuran</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  {THEME_OPTIONS.find((t) => t.value === themeColor)?.label || 'Custom'} • Scale {overlayScale}% • Opacity {cardOpacity}% • Radius {cardRadius}px
                </span>
              </span>
              <SettingsIcon />
            </button>
          </div>

        </div>

        {/* Right Column: Live Interactive Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col items-center sticky top-6">
            <div className="w-full flex justify-between items-center mb-3 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping mr-2"></span> Pratinjau
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
                <DownloadIcon /> Download Gambar
              </button>
            </div>
      
          </div>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <AnimatedTitle
  text="©2026 Oleh mas kiting"
  className="text-sm font-extrabold"
/>
        </div>
      </div>

      {/* Menu Setting: Tema & Slide */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end" role="dialog" aria-modal="true" aria-label="Setting tema dan slide">
          {/* Backdrop tipis supaya preview tetap terlihat */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowSettings(false)} />

          <div className="relative w-full md:w-[24rem] max-h-[78vh] md:max-h-full bg-slate-900 border border-slate-700 md:border-y-0 md:border-r-0 rounded-t-2xl md:rounded-none shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center">
                <SettingsIcon /> Setting
              </h3>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                aria-label="Tutup setting"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1.5 mx-5 mt-4 bg-slate-950 rounded-xl border border-slate-800">
              {[
                { id: 'tema', label: 'Tema' },
                { id: 'slide', label: 'Slide' },
                { id: 'thumbnail', label: 'Thumbnail' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSettingsTab(tab.id)}
                  className={`py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    settingsTab === tab.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Isi tab */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {settingsTab === 'tema' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Tema overlay</label>
                    <div className="grid grid-cols-2 gap-2">
                      {THEME_OPTIONS.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setThemeColor(t.value)}
                          aria-pressed={themeColor === t.value}
                          className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                            themeColor === t.value
                              ? 'border-emerald-400 bg-slate-800'
                              : 'border-slate-700 bg-slate-950 hover:bg-slate-800'
                          }`}
                        >
                          <span
                            className="w-8 h-8 rounded-lg shrink-0 border-t-4"
                            style={{ background: t.bg, borderTopColor: t.accent, borderColor: t.accent }}
                          />
                          <span className="text-[11px] font-medium text-slate-200 leading-tight">{t.label}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setThemeColor('custom')}
                        aria-pressed={themeColor === 'custom'}
                        className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 col-span-2 ${
                          themeColor === 'custom'
                            ? 'border-emerald-400 bg-slate-800'
                            : 'border-slate-700 bg-slate-950 hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-lg shrink-0 border-t-4"
                          style={{ background: customBgColor, borderTopColor: customAccentColor, borderColor: customAccentColor }}
                        />
                        <span className="text-[11px] font-medium text-slate-200 leading-tight">Custom (pilih warna sendiri)</span>
                      </button>
                    </div>
                  </div>

                  {themeColor === 'custom' && (
                    <div className="p-3 bg-slate-950 border border-teal-500/30 rounded-xl space-y-3">
                      <p className="text-[11px] text-teal-300 font-medium">Warna manual</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Background', value: customBgColor, set: setCustomBgColor },
                          { label: 'Teks alamat', value: customTextColor, set: setCustomTextColor },
                          { label: 'Aksen / judul', value: customAccentColor, set: setCustomAccentColor },
                        ].map((c) => (
                          <div key={c.label}>
                            <label className="block text-[10px] text-slate-400 mb-1">{c.label}</label>
                            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                              <input
                                type="color"
                                value={c.value}
                                onChange={(e) => c.set(e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                              />
                              <span className="text-[10px] font-mono">{c.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {settingsTab === 'slide' && (
                <>
                  {/* Posisi */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Posisi overlay</label>
                    <div className="grid grid-cols-2 gap-2">
                      {POSITION_OPTIONS.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => setOverlayPosition(o.value)}
                          aria-pressed={overlayPosition === o.value}
                          className={`py-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                            overlayPosition === o.value
                              ? 'border-emerald-400 bg-slate-800 text-emerald-300'
                              : 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scale */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Ukuran scale ({overlayScale}%)</label>
                      <button
                        type="button"
                        onClick={() => setOverlayScale(DEFAULT_SETTINGS.overlayScale)}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                      >
                        Reset ({DEFAULT_SETTINGS.overlayScale}%)
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

                  {/* Opacity */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Transparansi ({cardOpacity}%)</label>
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

                  {/* Radius */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Sudut kelengkungan ({cardRadius}px)</label>
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
                </>
              )}

              {settingsTab === 'thumbnail' && (
                <>
                  {/* Pratinjau + ganti gambar */}
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-24 shrink-0 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center">
                      {thumbImage ? (
                        <img src={thumbImage} alt="Thumbnail saat ini" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-500 text-center px-2">Belum ada gambar</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <button
                        type="button"
                        onClick={() => thumbInputRef.current?.click()}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition flex items-center justify-center cursor-pointer"
                      >
                        <UploadIcon /> Ganti gambar
                      </button>
                      <button
                        type="button"
                        onClick={() => setThumbImage('/peta-default.jpg')}
                        className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 transition cursor-pointer"
                      >
                        Pakai gambar default
                      </button>
                    </div>
                  </div>

                  {/* Tampilkan / sembunyikan */}
                  <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-700 rounded-xl">
                    <span className="text-xs font-semibold text-slate-300">Tampilkan thumbnail di overlay</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showThumb}
                      onClick={() => setShowThumb(!showThumb)}
                      className={`relative w-10 h-6 rounded-full transition cursor-pointer ${showThumb ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${showThumb ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  <div className={showThumb ? 'space-y-5' : 'space-y-5 opacity-40 pointer-events-none'}>
                    {/* Bentuk */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Bentuk</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'rounded', label: 'Bulat sudut' },
                          { value: 'square', label: 'Kotak' },
                          { value: 'circle', label: 'Lingkaran' },
                        ].map((o) => (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => setThumbShape(o.value)}
                            aria-pressed={thumbShape === o.value}
                            className={`py-2 rounded-xl border text-[11px] font-medium transition cursor-pointer ${
                              thumbShape === o.value
                                ? 'border-emerald-400 bg-slate-800 text-emerald-300'
                                : 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cara mengisi */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Cara mengisi gambar</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'cover', label: 'Penuh (crop tengah)' },
                          { value: 'contain', label: 'Utuh (tanpa crop)' },
                        ].map((o) => (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => setThumbFit(o.value)}
                            aria-pressed={thumbFit === o.value}
                            className={`py-2 rounded-xl border text-[11px] font-medium transition cursor-pointer ${
                              thumbFit === o.value
                                ? 'border-emerald-400 bg-slate-800 text-emerald-300'
                                : 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ukuran */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-300">Ukuran thumbnail ({thumbSizeSetting}px)</label>
                        <button
                          type="button"
                          onClick={() => setThumbSizeSetting(DEFAULT_SETTINGS.thumbSize)}
                          className="text-[10px] text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                        >
                          Reset ({DEFAULT_SETTINGS.thumbSize}px)
                        </button>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="180"
                        step="5"
                        value={thumbSizeSetting}
                        onChange={(e) => setThumbSizeSetting(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="grid grid-cols-2 gap-2 px-5 py-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetSettings}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition cursor-pointer"
              >
                Reset semua
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl text-xs font-bold text-white transition cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
