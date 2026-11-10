# MafoyoThink

Aplikasi kanvas gambar + AI (Gemini) + kalkulator Math. Dibangun mobile-first dengan React + Vite + Tailwind, dibungkus jadi APK memakai Capacitor.

## Fitur
- **Draw**: pensil, marker, penghapus, garis, kotak, lingkaran, undo/redo, ekspor PNG
- **AI**: tanya Gemini (boleh sertakan gambar kanvas). Key diisi pengguna sendiri
- **Math**: hitung ekspresi (sin/cos/tan dalam derajat), selesaikan persamaan linear & kuadrat (variabel `x`), preset

## Jalankan
```bash
npm install
npm run dev        # development
npm run build      # build ke folder dist/
```

## Aturan penting
- **Jangan** tanam Gemini API key di kode / APK / GitHub. Tiap pengguna isi sendiri di tab AI (disimpan di localStorage).
- Jangan commit `.env`, `.apk`, `.zip`.
- Mobile-first: kanvas prioritas, panel jadi bottom-sheet di HP, sidebar hanya di layar >= md.

## Dokumen
| File | Isi |
|---|---|
| [BRANCHING.md](BRANCHING.md) | aturan branch |
| [GIT-GUIDE.md](GIT-GUIDE.md) | pull → edit → commit → push di Acode |
| [PROTECTION.md](PROTECTION.md) | Branch Protection GitHub |
| [CAPACITOR.md](CAPACITOR.md) | web → APK |
| [APK-RELEASE.md](APK-RELEASE.md) | rilis APK stable |
| [CHANGELOG.md](CHANGELOG.md) | catatan perubahan + checklist rilis |
| [RESET-REPO.md](RESET-REPO.md) | ganti total isi repo |
