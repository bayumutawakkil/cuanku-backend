from pathlib import Path
from prophet.serialize import model_from_json

ROOT_DIR = Path(__file__).resolve().parent
MODEL_PATH = ROOT_DIR / "models" / "prophet_model.json"

_model_cache = None


def _get_model():
    global _model_cache
    if _model_cache is None:
        with open(MODEL_PATH, "r") as f:
            _model_cache = model_from_json(f.read())
    return _model_cache


def predict_trend(n_hari: int) -> list[dict]:
    model = _get_model()
    future = model.make_future_dataframe(periods=n_hari)
    forecast = model.predict(future)

    hasil_df = forecast.tail(n_hari)[["ds", "yhat", "yhat_lower", "yhat_upper"]]

    hasil = []
    for _, row in hasil_df.iterrows():
        hasil.append(
            {
                "tanggal": row["ds"].strftime("%Y-%m-%d"),
                "prediksi_rp": max(0, round(row["yhat"])),  # tidak mungkin minus
                "batas_bawah_rp": max(0, round(row["yhat_lower"])),
                "batas_atas_rp": max(0, round(row["yhat_upper"])),
            }
        )
    return hasil


if __name__ == "__main__":
    contoh = predict_trend(7)
    print("Contoh prediksi 7 hari ke depan:\n")
    for baris in contoh:
        print(
            f"{baris['tanggal']}  prediksi: Rp{baris['prediksi_rp']:,}"
            f"  (kisaran Rp{baris['batas_bawah_rp']:,} - Rp{baris['batas_atas_rp']:,})"
        )
