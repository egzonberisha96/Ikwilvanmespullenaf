"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
}

export function BlogEditorForm({ initial }: { initial: BlogPostData }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(form.id ? `/api/admin/blog/${form.id}` : "/api/admin/blog", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Artikel opgeslagen");
      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Opslaan mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-6">
      <div>
        <label className="label">Titel</label>
        <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div>
        <label className="label">Slug (URL)</label>
        <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
      </div>
      <div>
        <label className="label">Samenvatting</label>
        <textarea className="input min-h-[70px]" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
      </div>
      <div>
        <label className="label">Inhoud (Markdown)</label>
        <textarea className="input min-h-[240px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
      </div>
      <div>
        <label className="label">Meta titel (SEO)</label>
        <input className="input" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
      </div>
      <div>
        <label className="label">Meta omschrijving (SEO)</label>
        <textarea className="input min-h-[60px]" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-600">
        <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
        Publiceren
      </label>
      <button className="btn-primary" disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} />}
        Opslaan
      </button>
    </form>
  );
}
