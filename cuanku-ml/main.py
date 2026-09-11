from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import predict_trend

app = FastAPI(
    title="CuanKu ML Service",
    description="API Service untuk prediksi pendapatan berbasis Prophet",
    version="1.0.0"
)

# CORS agar API bisa dipanggil oleh backend/frontend tanpa terblokir
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputPrediksi(BaseModel):
    n_hari: int = 7

@app.post("/api/ml/predict-trend")
def dapatkan_prediksi(data: InputPrediksi):
    if data.n_hari <= 0 or data.n_hari > 90:
        raise HTTPException(
            status_code=400, 
            detail="Jumlah hari prediksi harus antara 1 sampai 90 hari."
        )
    try:
        hasil = predict_trend(data.n_hari)
        return {
            "status": "success",
            "total_hari": data.n_hari,
            "data": hasil
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def cek_server():
    return {"message": "Server ML CuanKu Berhasil Jalan!"}