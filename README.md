# CuanKu API

## Supabase

1. Buat project di Supabase.
2. Buka **SQL Editor** dan jalankan isi `schema.sql`.
3. Salin **Session pooler connection string** dari **Project Settings > Database > Connect**.
4. Isi `DATABASE_URL` di environment variables project backend. Ganti password dan placeholder region pada connection string.

## Deploy backend ke Vercel

Jadikan folder `cuanku-backend` sebagai **Root Directory** project Vercel, lalu tambahkan:

- `DATABASE_URL`: connection string Supabase Session pooler.
- `FRONTEND_URL`: URL deployment frontend, misalnya `https://cuanku.vercel.app`.
- `DB_POOL_MAX`: `1`.
- `ML_SERVICE_URL`: URL publik service FastAPI pada folder `CuanKu/ml-service`.

Vercel akan memakai `api/index.js` sebagai serverless function. Endpoint tetap menggunakan prefix `/api`, misalnya `/api/auth/masuk`.

## Deploy frontend ke Vercel

Jadikan folder `cuanku-frontend` sebagai root project Vercel dan tambahkan:

- `NEXT_PUBLIC_API_URL`: URL backend Vercel dengan suffix `/api`, misalnya `https://cuanku-api.vercel.app/api`.

Setelah environment variable ditambahkan, lakukan redeploy agar nilainya masuk ke build production.

Service machine learning Python tidak berjalan di Vercel backend secara otomatis. Deploy `CuanKu/ml-service` ke Railway, Render, atau Cloud Run, pastikan endpoint `POST /api/ml/predict-trend` aktif, lalu masukkan URL deployment-nya sebagai `ML_SERVICE_URL`.

Preset Vercel dapat memakai **Other**. Biarkan Build Command dan Output Directory kosong; Vercel akan mendeteksi `api/index.js` sebagai serverless function. Pastikan **Install Command** menggunakan `npm install` dan jangan mengaktifkan `npm run build` karena backend ini tidak memiliki tahap build.

Untuk pengembangan lokal, salin `.env.example` menjadi `.env` dan isi nilai yang sesuai.