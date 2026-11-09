# MafoyuThink

Aplikasi ruang belajar digital berbasis **React + Vite + Tailwind CSS + Capacitor**.

> Repository GitHub bernama **MafoyoThink**. Nama produk di antarmuka ditulis **MafoyuThink**, mengikuti nama paket proyek yang diminta.

## Fitur yang tersedia
- Papan tulis responsif: pensil, marker, penghapus, garis, persegi, lingkaran, dan panah.
- Pengaturan warna, ukuran kuas, dan opasitas.
- Undo/redo, bersihkan kanvas, dan ekspor PNG.
- Kalkulator ekspresi matematika berbasis Math.js; tidak menggunakan `eval` atau `new Function`.
- Studio gambar AI melalui endpoint backend yang dapat dikonfigurasi. API key tidak disimpan di aplikasi klien.

## Teknologi
- React 18
- Vite 6
- Tailwind CSS 3
- Capacitor 7
- Math.js
- Lucide React

## Menjalankan proyek
```bash
npm install
npm run dev
```

## Build web
```bash
npm run build
npm run preview
```

## Android
Pastikan Android Studio dan Android SDK telah terpasang.
```bash
npm install
npx cap add android
npm run build
npx cap sync android
npx cap open android
```

## Konfigurasi Studio AI
Buat file `.env` lokal berdasarkan `.env.example`, lalu isi `VITE_AI_API_URL` dengan URL backend milikmu. Backend menerima JSON `{ "prompt": "...", "style": "..." }` dan mengembalikan `{ "imageUrl": "..." }` atau `{ "imageBase64": "...", "mimeType": "image/png" }`. Jangan pernah menaruh secret API key provider AI di frontend atau APK.

## Branch
- `main`: rilis APK stable.
- `pre/apk`: rilis APK preview.
- `fix/Code`: perbaikan bug dan error.
- `UP/System&UI`: pengembangan sistem dan UI.

## Catatan
Struktur ini merupakan fondasi modular awal untuk pengembangan lanjutan. Uji di browser dan perangkat Android sebelum membuat rilis produksi.
