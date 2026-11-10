# Panduan Git di Acode

## Urutan wajib
**PULL → Edit → Save → Add → Commit → Push**

1. **Pull** dulu supaya tidak bentrok.
2. Edit file, lalu **Save**.
3. **Add** (stage) file yang berubah.
4. **Commit** dengan pesan singkat yang jelas, mis. `fix: undo tidak jalan di marker`.
5. **Push** ke branch kerjamu (`fix/Codex` atau `UP/System&UI`), lalu buka PR.

## Jangan
- `git push --force` ke `main` / `pre/APK`.
- Commit `.env`, `.apk`, `.zip`, `node_modules`.
- Edit di GitHub web saat sedang mengedit di Acode (akan bentrok).
