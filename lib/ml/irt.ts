// TIER 2 — ML/Stats. Pure function, tanpa panggilan eksternal.
// Item Response Theory (IRT) — 3PL model untuk estimasi theta (kemampuan).
import type { ItemParams, ItemResponse, ThetaEstimate } from "../intelligence/types";

/**
 * Probabilitas menjawab benar pada 3PL IRT:
 * P(θ) = c + (1-c) / (1 + exp(-a * (θ - b)))
 */
function prob3pl(theta: number, { a, b, c }: { a: number; b: number; c: number }): number {
  return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
}

/**
 * Estimasi theta (kemampuan laten) dengan Maximum Likelihood Estimation (MLE).
 * Menggunakan Newton-Raphson iteratif.
 *
 * @param responses - array benar/salah per soal
 * @param items     - parameter IRT per soal (a, b, c)
 * @param maxIter   - iterasi maksimal (default 20)
 * @returns ThetaEstimate { theta, se }
 *
 * TODO: Upgrade ke Bayesian EAP (Expected A Posteriori) untuk akurasi lebih baik pada
 *       sample kecil (<20 soal). Referensi: Baker & Kim (2004) Item Response Theory.
 */
export function estimateTheta(
  responses: ItemResponse[],
  items: ItemParams[],
  maxIter = 20,
): ThetaEstimate {
  const itemMap = new Map(items.map((i) => [i.questionId, i]));

  const pairs = responses
    .map((r) => ({ u: r.benar ? 1 : 0, item: itemMap.get(r.questionId) }))
    .filter((p): p is { u: number; item: ItemParams } => p.item !== undefined);

  if (pairs.length === 0) return { theta: 0, se: 1 };

  let theta = 0; // start estimate
  for (let iter = 0; iter < maxIter; iter++) {
    let grad = 0, hess = 0;
    for (const { u, item } of pairs) {
      const { a, b, c } = item;
      const P = prob3pl(theta, { a, b, c });
      const Q = 1 - P;
      const W = (a * (P - c)) / (1 - c);
      grad += W * (u - P) / (P * Q + 1e-9);
      hess -= (W * W) / (P * Q + 1e-9);
    }
    const step = hess !== 0 ? -grad / hess : 0;
    theta += Math.max(-1, Math.min(1, step)); // clamp step
    if (Math.abs(step) < 1e-4) break;
  }

  // Standard error dari Fisher Information
  let info = 0;
  for (const { item } of pairs) {
    const { a, b, c } = item;
    const P = prob3pl(theta, { a, b, c });
    const Q = 1 - P;
    info += (a * (P - c)) ** 2 / ((1 - c) ** 2 * P * Q + 1e-9);
  }
  const se = info > 0 ? 1 / Math.sqrt(info) : 1;

  return { theta: Math.round(theta * 1000) / 1000, se: Math.round(se * 1000) / 1000 };
}
