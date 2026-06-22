"use client";

import { useState } from "react";
import { Plus, Upload, Mail, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { createQuestion, createTopic, createSchool, createBlueprint, sendPasswordReset } from "@/lib/actions/console";
import { CreateModal, MField, MTextarea, MSelect } from "@/components/admin/create-modal";

const MAPEL = [
  { value: "Penalaran Umum", label: "Penalaran Umum" },
  { value: "Pengetahuan Kuantitatif", label: "Pengetahuan Kuantitatif" },
  { value: "Penalaran Matematika", label: "Penalaran Matematika" },
  { value: "Literasi Bahasa Indonesia", label: "Literasi Bahasa Indonesia" },
  { value: "Literasi Bahasa Inggris", label: "Literasi Bahasa Inggris" },
  { value: "Pemahaman Bacaan dan Menulis", label: "Pemahaman Bacaan dan Menulis" },
  { value: "Pengetahuan dan Pemahaman Umum", label: "Pengetahuan dan Pemahaman Umum" },
  { value: "TWK", label: "TWK (CPNS)" },
  { value: "TIU", label: "TIU (CPNS)" },
  { value: "TKP", label: "TKP (CPNS)" },
];

const LEVELS = [
  { value: "1", label: "L1 — Sangat Mudah" },
  { value: "2", label: "L2 — Mudah" },
  { value: "3", label: "L3 — Sedang" },
  { value: "4", label: "L4 — Sulit" },
  { value: "5", label: "L5 — Sangat Sulit" },
];

const KUNCI = [
  { value: "A", label: "A" }, { value: "B", label: "B" }, { value: "C", label: "C" },
  { value: "D", label: "D" }, { value: "E", label: "E" },
];

// Tombol "Soal Baru" + modal (Bank Soal).
export function NewQuestionButton() {
  return (
    <CreateModal label="Soal Baru" title="Tambah Soal" subtitle="Kunci jawaban disimpan aman di server, tak pernah dikirim ke siswa." action={createQuestion}>
      <div className="grid gap-4 sm:grid-cols-2">
        <MSelect label="Mata Pelajaran" name="mapel" options={MAPEL} />
        <MField label="Kode (opsional)" name="kode" placeholder="cth. PU-001" />
      </div>
      <MTextarea label="Teks Soal" name="soal" required rows={3} placeholder="Tulis pertanyaan di sini…" />
      <div className="grid gap-4 sm:grid-cols-2">
        <MField label="Opsi A" name="opsi_a" placeholder="Jawaban A" />
        <MField label="Opsi B" name="opsi_b" placeholder="Jawaban B" />
        <MField label="Opsi C" name="opsi_c" placeholder="Jawaban C" />
        <MField label="Opsi D" name="opsi_d" placeholder="Jawaban D" />
        <MField label="Opsi E" name="opsi_e" placeholder="Jawaban E" />
        <MSelect label="Kunci Jawaban" name="answer_key" options={KUNCI} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <MSelect label="Tingkat Kesulitan" name="level_kesulitan" options={LEVELS} defaultValue="3" />
        <MField label="Cognitive Skill (opsional)" name="cognitive_skill" placeholder="cth. analisis" />
      </div>
      <MTextarea label="Pembahasan (opsional)" name="pembahasan" rows={2} placeholder="Penjelasan jawaban…" />
    </CreateModal>
  );
}

// Tombol "Tambah Topik" + modal (Taksonomi).
export function NewTopicButton() {
  return (
    <CreateModal label="Tambah Topik" title="Tambah Topik" subtitle="Topik menjadi dasar weakness mapping & smart revision." action={createTopic}>
      <MField label="Nama Topik" name="nama" required placeholder="cth. Aljabar Linear" />
      <MSelect label="Mata Pelajaran" name="mapel" options={MAPEL} />
      <div className="grid gap-4 sm:grid-cols-2">
        <MSelect label="Level Hierarki" name="level" options={[
          { value: "1", label: "L1 — Mapel" }, { value: "2", label: "L2 — Bab" }, { value: "3", label: "L3 — Subtopik" },
        ]} defaultValue="2" />
        <MField label="Urutan" name="urutan" type="number" defaultValue={0} />
      </div>
    </CreateModal>
  );
}

// Tombol "Tambah Sekolah" + modal (Sekolah Mitra).
export function NewSchoolButton() {
  return (
    <CreateModal label="Tambah Sekolah" title="Tambah Sekolah Mitra" subtitle="Kode gabung dibuat otomatis untuk pendaftaran siswa." action={createSchool}>
      <MField label="Nama Sekolah" name="nama" required placeholder="cth. SMAN 1 Yogyakarta" />
      <div className="grid gap-4 sm:grid-cols-2">
        <MField label="Kota" name="kota" placeholder="cth. Yogyakarta" />
        <MField label="Provinsi" name="provinsi" placeholder="cth. DI Yogyakarta" />
      </div>
      <MSelect label="Paket" name="plan" options={[
        { value: "free", label: "Free" }, { value: "school_basic", label: "School Basic" }, { value: "school_pro", label: "School Pro" },
      ]} />
    </CreateModal>
  );
}

// Tombol "Blueprint Baru" + modal.
export function NewBlueprintButton() {
  return (
    <CreateModal label="Blueprint Baru" title="Buat Blueprint" subtitle="Template komposisi soal untuk auto-generate paket try out." action={createBlueprint}>
      <MField label="Nama Blueprint" name="nama" required placeholder="cth. Paket SNBT Standar" />
      <div className="grid gap-4 sm:grid-cols-2">
        <MSelect label="Tipe" name="tipe" options={[
          { value: "SNBT", label: "SNBT" }, { value: "SKD CPNS", label: "SKD CPNS" }, { value: "Mandiri", label: "Mandiri" },
        ]} />
        <MField label="Durasi (menit)" name="durasi_menit" type="number" defaultValue={100} />
      </div>
      <MTextarea label="Komposisi" name="komposisi" rows={5} placeholder={"Satu baris per mapel, format: Mapel | jumlah\ncth:\nPenalaran Umum | 30\nLiterasi Bahasa Indonesia | 30"} />
    </CreateModal>
  );
}

// Tombol kirim email reset password (detail pengguna).
export function ResetPasswordButton({ email }: { email: string | null }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function send() {
    if (!email) { setState("error"); setMsg("Email pengguna tidak tersedia."); return; }
    setState("busy"); setMsg(null);
    const res = await sendPasswordReset(email);
    if (res.ok) { setState("done"); setMsg(null); }
    else { setState("error"); setMsg(res.error ?? "Gagal mengirim."); }
  }

  return (
    <div>
      <button onClick={send} disabled={state === "busy" || state === "done"}
        className="flex w-full items-center gap-2 rounded-lg border px-4 py-2.5 text-body-sm font-semibold text-ink hover:bg-muted disabled:opacity-60">
        {state === "busy" ? <Loader2 size={15} className="animate-spin" /> : state === "done" ? <Check size={15} className="text-[#16B47A]" /> : <Mail size={15} />}
        {state === "done" ? "Email terkirim" : "Kirim Email Reset Password"}
      </button>
      {state === "error" && msg ? <p className="mt-2 text-caption text-[#E5484D]">{msg}</p> : null}
      {state === "done" ? <p className="mt-2 text-caption text-ink-muted">Tautan reset dikirim ke {email}.</p> : null}
    </div>
  );
}

// Tombol "Paket Baru" (Try Out) — mengarah ke halaman buat.
export function NewTryOutButton() {
  return (
    <Link href="/staf/try-out/buat" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-body-sm font-semibold text-white hover:bg-brand-600">
      <Plus size={15} /> Paket Baru
    </Link>
  );
}

export { Upload };
