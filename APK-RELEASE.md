# Cara Rilis APK Stable

`main` = siap stable, **bukan** langsung rilis tiap push.

## Dua cara rilis
1. **Tag**: buat tag `v1.0.0` di commit `main` → workflow *Build APK* jalan dan membuat GitHub Release berisi APK.
2. **Manual**: Actions → *Build APK* → **Run workflow** → isi `release_version` (mis. `v1.0.0`).

Kosongkan `release_version` = hanya build artifact (tanpa Release).

## Prinsip
- Jangan rilis `v1.0.1` hari ini, `v1.0.2` besok. Kumpulkan dulu di `pre/APK`, tes, lalu rilis sekali yang matang.
- Ikuti checklist di [CHANGELOG.md](CHANGELOG.md).
- APK yang dihasilkan masih **Debug**. Release + signing (Play Store) belum dibuat.
