# Changelog

Format: tambahkan di atas. Kelompokkan: **Ditambah / Diubah / Diperbaiki**.

## [Belum dirilis]
- (isi perubahan yang sedang dikumpulkan di `pre/APK`)

## [0.1.0] - awal
### Ditambah
- Kanvas gambar (Pointer Events): pensil, marker, penghapus, garis, kotak, lingkaran
- Undo / redo, bersihkan, ekspor PNG
- Tab AI: Gemini dengan key dari pengguna (localStorage)
- Tab Math: evaluator aman, sin/cos/tan derajat, persamaan linear & kuadrat, preset
- Layout mobile-first: bottom-sheet di HP, sidebar di desktop
- GitHub Actions: build APK, cek build web, deploy Pages (opsional)

---

## Checklist rilis stable
- [ ] Semua PR sudah masuk `pre/APK`
- [ ] APK dari `pre/APK` sudah dites di HP (gambar, undo/redo, AI, Math)
- [ ] Tidak ada key / `.env` ikut ter-commit
- [ ] CHANGELOG sudah diisi & versi ditentukan (mis. v1.0.0)
- [ ] PR `pre/APK` → `main` di-merge
- [ ] Tag `v...` dibuat (atau run workflow manual + `release_version`)
- [ ] APK di GitHub Release sudah dicoba pasang
