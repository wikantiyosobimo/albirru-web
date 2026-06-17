// TIER 2 — ML/Stats. Pure function, tanpa panggilan eksternal.
import type { SkorRiwayat, PrediksiSkor } from "../intelligence/types";

/**
 * Prediksi skor akhir menggunakan weighted moving average + linear trend.
 * Tier 2 (stats sederhana) — untuk prediksi lebih canggih gunakan Tier 3 (Claude).
 *
 * @param riwayat    - array skor historis (urutkan ASC tanggal)
 * @param hariKe     - berapa hari ke ujian (untuk interval kepercayaan)
 *
 * TODO: ganti dengan regresi logistik atau ARIMA jika riwayat >= 10 data poin.
 */
export function prediksiSkorAkhir(
  riwayat: SkorRiwayat[],
  hariKe = 30,
): PrediksiSkor {
  if (riwayat.length === 0) {
    return { proyeksi: 0, bawah: 0, atas: 0, keyakinan: 0 };
  }
  if (riwayat.length === 1) {
    const s = riwayat[0].skor;
    return { proyeksi: s, bawah: Math.max(0, s - 100), atas: Math.min(1000, s + 100), keyakinan: 0.3 };
  }

  const sorted = [...riwayat].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const n = sorted.length;

  // Weighted moving average: bobot lebih besar ke data terbaru
  const weights = sorted.map((_, i) => i + 1);
  const totalW = weights.reduce((s, w) => s + w, 0);
  const wma = sorted.reduce((s, r, i) => s + r.skor * weights[i], 0) / totalW;

  // Slope dari linear regression sederhana
  const xMean = (n - 1) / 2;
  const yMean = sorted.reduce((s, r) => s + r.skor, 0) / n;
  let num = 0, den = 0;
  sorted.forEach((r, i) => {
    num += (i - xMean) * (r.skor - yMean);
    den += (i - xMean) ** 2;
  });
  const slope = den !== 0 ? num / den : 0;

  // Proyeksi: WMA + slope * estimasi sisa sesi
  const estimasiSesiSisa = Math.round(hariKe / 7 * 2); // ~2 tryout per minggu
  const proyeksi = Math.round(Math.min(1000, Math.max(0, wma + slope * estimasiSesiSisa)));

  // Interval kepercayaan: std dev dari riwayat
  const std = Math.sqrt(sorted.reduce((s, r) => s + (r.skor - yMean) ** 2, 0) / n);
  const margin = Math.round(std * 1.5); // ~90% interval
  const keyakinan = Math.min(0.95, 0.5 + (n / 20) * 0.45); // makin banyak data, makin yakin

  return {
    proyeksi,
    bawah: Math.max(0, proyeksi - margin),
    atas: Math.min(1000, proyeksi + margin),
    keyakinan: Math.round(keyakinan * 100) / 100,
  };
}
