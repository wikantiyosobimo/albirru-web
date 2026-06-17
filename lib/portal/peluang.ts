// Estimasi peluang lolos dari skor terhadap target (kurva logistik).
// Kalibrasi: skor == target → ~86%, skor == target-130 → 50%, makin jauh makin rendah.
export function peluangLolos(skor: number, target: number): number {
  const center = target - 130;
  const scale = 70;
  const p = 1 / (1 + Math.exp(-(skor - center) / scale));
  return Math.min(98, Math.max(2, Math.round(p * 100)));
}

export function warnaPeluang(p: number): string {
  if (p >= 70) return "#16B47A";
  if (p >= 45) return "#E8910B";
  return "#E5484D";
}

// Label & warna status penguasaan subtes dari persentase benar.
export function statusSubtes(persen: number): { label: string; sc: string; sb: string; bar: string } {
  if (persen >= 85) return { label: "Sangat Kuat", sc: "#16864F", sb: "#DCF5EA", bar: "#16B47A" };
  if (persen >= 70) return { label: "Kuat", sc: "#16864F", sb: "#DCF5EA", bar: "#16B47A" };
  if (persen >= 50) return { label: "Cukup", sc: "#B7791F", sb: "#FFF1DC", bar: "#E8910B" };
  return { label: "Lemah", sc: "#C13030", sb: "#FDECEC", bar: "#E5484D" };
}
