# CuanKu ML Service

Service FastAPI untuk prediksi tren pendapatan menggunakan model Prophet.

## Menjalankan lokal

Dari folder `cuanku-ml`:

```powershell
uv sync
uv run uvicorn main:app --reload --port 8001
```

Endpoint yang tersedia:

- `GET /` untuk mengecek service.
- `POST /api/ml/predict-trend` dengan body `{"n_hari": 7}`.

Backend Express memanggil endpoint tersebut melalui environment variable
`ML_SERVICE_URL`, dengan nilai lokal default `http://127.0.0.1:8001`.

## Deployment

Jadikan folder `cuanku-ml` sebagai root project pada Railway, Render, atau Cloud
Run. Gunakan command berikut sebagai start command:

```text
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set URL hasil deployment sebagai `ML_SERVICE_URL` pada backend.