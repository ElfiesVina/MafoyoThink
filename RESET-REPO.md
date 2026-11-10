# Mengganti Total Isi Repo

Pakai ini hanya bila ingin menimpa seluruh isi repo dengan proyek baru.

> Peringatan: riwayat lama bisa hilang. Cadangkan dulu. Jika Branch Protection aktif, matikan sementara.

## Cara aman (isi diganti, riwayat tetap)
```bash
git checkout -b UP/reset-isi
# hapus semua file lama (kecuali .git), salin proyek baru ke folder ini
git rm -r --cached . && git add -A
git commit -m "chore: ganti total isi repo"
git push -u origin UP/reset-isi
# lalu buka PR -> pre/APK -> main
```

## Jangan
- `git push --force` ke `main` / `pre/APK`.
- Meng-commit `.env`, `.apk`, `.zip`, `node_modules`.
