// TIER 3 — Claude AI. HANYA file di lib/ai/* yang boleh memanggil Claude API.
// Gunakan fetch langsung (tanpa SDK) agar tidak ada dependensi tambahan.
// Server-side only — jangan import file ini di komponen client.

export type ClaudeModel = "claude-haiku-4-5-20251001" | "claude-sonnet-4-6";

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeOptions {
  model?: ClaudeModel;
  max_tokens?: number;
  system?: string;
  temperature?: number;
}

export interface ClaudeResponse {
  content: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
}

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

/**
 * Wrapper Claude API via fetch.
 * Panggil hanya dari lib/ai/*.ts — TIDAK PERNAH dari client component.
 *
 * Gunakan haiku untuk tugas singkat (insight, review), sonnet untuk generasi soal penuh.
 */
export async function callClaude(
  messages: ClaudeMessage[],
  opts: ClaudeOptions = {},
): Promise<ClaudeResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY tidak ditemukan di environment.");

  const model: ClaudeModel = opts.model ?? "claude-haiku-4-5-20251001";
  const body = {
    model,
    max_tokens: opts.max_tokens ?? 1024,
    system: opts.system,
    temperature: opts.temperature ?? 0.3,
    messages,
  };

  const res = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Claude API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text: string }[];
    model: string;
    usage: { input_tokens: number; output_tokens: number };
  };

  const content = data.content.find((c) => c.type === "text")?.text ?? "";
  return {
    content,
    model: data.model,
    input_tokens: data.usage.input_tokens,
    output_tokens: data.usage.output_tokens,
  };
}

/** Helper: parse JSON dari response Claude dengan fallback graceful. */
export function parseJsonResponse<T>(raw: string, fallback: T): T {
  try {
    const match = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    return JSON.parse(match ? match[1] : raw) as T;
  } catch {
    return fallback;
  }
}
