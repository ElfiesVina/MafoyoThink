# Membungkus Web jadi APK dengan Capacitor

Web belum otomatis jadi APK. Capacitor membungkus hasil build (`dist/`) ke proyek Android.

## Konfigurasi
`capacitor.config.ts`: `appId = com.mafoyo.think`, `appName = MafoyoThink`, `webDir = dist`.

## Cara otomatis (disarankan)
Folder `android/` **tidak** di-commit (ada di `.gitignore`). GitHub Actions membuatnya sendiri tiap build:
`npm run build` → `npx cap add android` → `npx cap sync android` → `./gradlew assembleDebug`.

## Alur harian
1. Edit di Acode → push.
2. Actions build otomatis (push ke `pre/APK`).
3. Unduh APK dari **Actions → run terakhir → Artifacts**.

## Cara manual (di komputer)
```bash
npm install
npm run build
npx cap add android      # sekali saja
npx cap sync android
cd android && ./gradlew assembleDebug
# hasil: android/app/build/outputs/apk/debug/app-debug.apk
```

## Catatan
- APK dari Actions = **APK Debug** (bisa dipasang & dibagi via WA / Drive).
- Untuk Play Store dibutuhkan APK/AAB **Release + signing** (belum dibuat).
- Tombol ekspor PNG memakai unduhan browser; di WebView bisa terbatas. Nanti bisa ditambah plugin Capacitor Filesystem/Share.
