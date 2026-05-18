# Deploy on Railway

This app runs as **one Railway service**: Express serves the API and the built React site on the same URL.

## 1. Push code to GitHub

Ensure the repo includes the `Solar/` folder with `frontend/`, `backend/`, and the root `package.json` in `Solar/`.

## 2. Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in.
2. **New Project** → **Deploy from GitHub repo**.
3. Select your repository.
4. Open **Settings** → **Root Directory** → set to: `Solar`
5. Railway will detect `nixpacks.toml` / `railway.toml` and build automatically.

## 3. Environment variables

In Railway → your service → **Variables**, add:

| Variable | Required | Example |
|----------|----------|---------|
| `EMAIL_USER` | Yes (for email) | your Gmail address |
| `EMAIL_PASS` | Yes (for email) | Gmail [App Password](https://support.google.com/accounts/answer/185833) |
| `EMAIL_FROM` | No | `Raghav Solar <your@gmail.com>` |
| `EMAIL_HOST` | No | `smtp.gmail.com` |
| `EMAIL_PORT` | No | `587` |
| `EMAIL_SECURE` | No | `false` |
| `COMPANY_EMAIL` | No | `raghav.enterpris1@gmail.com` |

Railway sets `PORT` automatically — do not override it.

## 4. Persistent database (optional)

By default SQLite lives on ephemeral disk (data may reset on redeploy).

To keep submissions:

1. Railway → service → **Volumes** → **Add Volume** (e.g. mount path `/data`).
2. Add variable: `DATABASE_DIR` = `/data`

## 5. Public URL

1. **Settings** → **Networking** → **Generate Domain**.
2. Open the `*.up.railway.app` URL — your site and `/api/*` work on the same host.

## 6. Verify

- Site loads: `https://your-app.up.railway.app/`
- Health: `https://your-app.up.railway.app/api/health`
- Submit contact / calculator forms and check `raghav.enterpris1@gmail.com`.

## Local production test

```bash
cd Solar
npm run build
npm start
```

Open `http://localhost:5000` (API + frontend together).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Forms return HTML / JSON error | Redeploy after setting **Root Directory** to `Solar`. Ensure build logs show `frontend/dist` created. |
| Emails not sent | Set `EMAIL_USER` and `EMAIL_PASS` in Railway variables; use a Gmail App Password. |
| 502 on deploy | Check deploy logs; confirm `node backend/server.js` starts and `/api/health` returns 200. |
