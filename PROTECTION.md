# Mengaktifkan Branch Protection (sekali saja, lewat GitHub web)

Lakukan untuk **`main`** dan **`pre/APK`**:

1. Repo → **Settings** → **Branches** → **Add branch ruleset** (atau *Add rule*).
2. Target: `main` (ulangi untuk `pre/APK`).
3. Centang:
   - **Require a pull request before merging**
   - **Require status checks to pass** (pilih job dari `Build Web`)
   - **Block force pushes**
   - **Restrict deletions** (blok penghapusan)
4. Simpan.

Setelah aktif, push langsung ke `main` / `pre/APK` ditolak — harus lewat PR.

> Catatan: status check baru bisa dipilih setelah workflow `Build Web` pernah berjalan sekali.
