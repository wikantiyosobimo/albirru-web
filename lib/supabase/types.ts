// Minimal hand-written types. For full typing, generate with:
//   npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
export type LeadRow = {
  id: string;
  nama: string;
  email: string;
  asal_sekolah: string | null;
  source: string | null;
  created_at: string;
};

export type LeadInsert = {
  nama: string;
  email: string;
  asal_sekolah?: string | null;
  source?: string;
};
