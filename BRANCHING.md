# Aturan Branch

| Branch | Fungsi | Catatan |
|---|---|---|
| `main` | rilis **stable** | jangan edit / push langsung |
| `pre/APK` | pre-rilis untuk tes ke teman | boleh sering diperbarui; push ke sini memicu build APK |
| `fix/Codex` | tempat fix bug | |
| `UP/System&UI` | upgrade sistem & UI | |

## Alur
```
fix/Codex ─┐
           ├─► PR ─► pre/APK ─► PR ─► main
UP/System&UI ┘
```

## Aturan
- 1 PR = 1 tujuan.
- Jangan `git push --force` ke `main` / `pre/APK`.
- Kumpulkan perubahan di `pre/APK`, tes dulu, baru rilis ke `main`.
