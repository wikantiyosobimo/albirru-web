import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, User, BookOpen, Quote } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS, getPost, getRelated, type BlogBlock } from "@/lib/data/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  return { title: post ? `${post.judul} — Blog Albirru` : "Artikel — Blog Albirru" };
}

function tanggalID(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function Block({ b }: { b: BlogBlock }) {
  if (b.tipe === "h2") return <h2 className="mt-8 text-h-sm text-ink">{b.teks}</h2>;
  if (b.tipe === "p") return <p className="mt-4 text-body text-ink-body">{b.teks}</p>;
  if (b.tipe === "list") return (
    <ul className="mt-4 space-y-2">
      {b.item.map((it) => <li key={it} className="flex gap-2.5 text-body text-ink-body"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" /> {it}</li>)}
    </ul>
  );
  return (
    <blockquote className="mt-6 rounded-xl border-l-4 border-brand bg-brand-100/50 p-5">
      <Quote size={20} className="text-brand-300" />
      <p className="mt-2 text-body-lg font-semibold text-ink">{b.teks}</p>
    </blockquote>
  );
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const related = getRelated(params.slug, 3);

  return (
    <>
      <section className="border-b bg-muted">
        <Container className="py-12">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand hover:underline"><ArrowLeft size={15} /> Kembali ke Blog</Link>
          <span className="mt-5 inline-flex rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold uppercase text-white">{post.kategori}</span>
          <h1 className="mt-3 max-w-3xl text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] font-extrabold leading-[1.15] tracking-tight text-ink">{post.judul}</h1>
          <p className="mt-3 max-w-2xl text-body-lg text-ink-body">{post.ringkasan}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-caption text-ink-muted">
            <span className="flex items-center gap-1.5"><User size={13} /> {post.penulis}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={13} /> {tanggalID(post.tanggal)}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {post.baca_menit} min read</span>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <article className="min-w-0">
            <div className="grad-photo mb-8 flex aspect-[2/1] items-center justify-center rounded-2xl bg-navy-800 text-white/30"><BookOpen size={56} /></div>
            {post.isi.map((b, i) => <Block key={i} b={b} />)}

            <div className="mt-10 rounded-2xl bg-navy-900 px-6 py-8 text-center">
              <h3 className="text-h-sm text-white">Siap menerapkan strategi ini?</h3>
              <p className="mt-1 text-body-sm text-white/72">Mulai try out gratis dan lihat peta kelemahanmu secara otomatis.</p>
              <div className="mt-4 flex justify-center"><Button href="/daftar" variant="primary" trailingIcon={ArrowRight}>Mulai Gratis</Button></div>
            </div>
          </article>

          <aside>
            <div className="rounded-xl border bg-white p-5">
              <h3 className="text-h-sm text-ink">Artikel Terkait</h3>
              <div className="mt-4 space-y-4">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="block group">
                    <span className="text-[10px] font-bold uppercase text-brand">{r.kategori}</span>
                    <div className="mt-0.5 text-body-sm font-bold text-ink group-hover:text-brand">{r.judul}</div>
                    <div className="mt-1 flex items-center gap-1 text-caption text-ink-muted"><Clock size={11} /> {r.baca_menit} min read</div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
