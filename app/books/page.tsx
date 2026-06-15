'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BookOpen, Plus, Pencil, Trash2, Star, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface Book {
  id: number; title: string; author: string; description: string;
  cover_url: string; download_url: string; is_featured: boolean;
  is_published: boolean; sort_order: number; created_at: string;
}

const EMPTY = {
  title: '', author: 'Evangelist Bob Edward', description: '',
  cover_url: '', download_url: '', is_featured: false,
  is_published: true, sort_order: 0,
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/books');
    const data = await res.json();
    setBooks(data.books || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (b: Book) => {
    setEditing(b);
    setForm({ title: b.title, author: b.author, description: b.description || '',
      cover_url: b.cover_url || '', download_url: b.download_url,
      is_featured: b.is_featured, is_published: b.is_published, sort_order: b.sort_order });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/books/${editing.id}` : '/api/books';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this book? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    setDeleting(null);
    load();
  };

  const toggleFeatured = async (b: Book) => {
    await fetch(`/api/books/${b.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...b, is_featured: !b.is_featured }),
    });
    load();
  };

  const togglePublished = async (b: Book) => {
    await fetch(`/api/books/${b.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...b, is_published: !b.is_published }),
    });
    load();
  };

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(232,76,14,0.2)', borderRadius: 6, padding: '11px 14px', color: 'white', fontSize: 15, outline: 'none' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: 2, color: 'rgba(232,76,14,0.8)', textTransform: 'uppercase', marginBottom: 8 };

  return (
    <AdminLayout title="Books">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
          Manage all ministry books. The featured book appears on the homepage.
        </p>
        <button onClick={openNew} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={15} /> Add New Book
        </button>
      </div>

      {/* Book form modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,16,28,0.88)', backdropFilter: 'blur(8px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ background: 'linear-gradient(160deg,#0B1A2E,#152744)', border: '1px solid rgba(232,76,14,0.2)', borderRadius: 12, padding: 28, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 20 }}>
              {editing ? 'Edit Book' : 'Add New Book'}
            </h2>
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={lbl}>Book Title *</label>
                <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inp} placeholder="In the Fullness of His Blessings" />
              </div>
              <div>
                <label style={lbl}>Author *</label>
                <input required type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} style={inp} />
              </div>
              <div>
                <label style={lbl}>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} placeholder="A short description shown on the website..." />
              </div>
              <div>
                <label style={lbl}>Download URL *</label>
                <input required type="text" value={form.download_url} onChange={e => setForm({...form, download_url: e.target.value})} style={inp} placeholder="https://drive.google.com/... or /book/filename.pdf" />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
                  Paste a Google Drive link, Dropbox link, or the path to a PDF in /public/book/
                </p>
              </div>
              <div>
                <label style={lbl}>Cover Image URL</label>
                <input type="text" value={form.cover_url} onChange={e => setForm({...form, cover_url: e.target.value})} style={inp} placeholder="https://... or /images/book-cover.jpg" />
                {form.cover_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.cover_url} alt="Cover preview" style={{ height: 80, width: 'auto', marginTop: 8, borderRadius: 4, objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
                )}
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Featured on homepage</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Published</span>
                </label>
              </div>
              {form.is_featured && (
                <p style={{ fontSize: 11, color: 'rgba(232,76,14,0.7)', background: 'rgba(232,76,14,0.08)', padding: '8px 12px', borderRadius: 6 }}>
                  This book will appear on the homepage. Any previously featured book will be unfeatured.
                </p>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                  {saving ? 'Saving...' : editing ? 'Update Book' : 'Add Book'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ padding: '12px 20px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Books list */}
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading...</p>
      ) : books.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px dashed rgba(232,76,14,0.2)' }}>
          <BookOpen size={40} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>No books yet</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>Add your first book to get started</p>
          <button onClick={openNew} className="btn-primary"><Plus size={14} /> Add First Book</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {books.map(b => (
            <div key={b.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${b.is_featured ? 'rgba(232,76,14,0.4)' : 'rgba(232,76,14,0.1)'}`, borderRadius: 10, padding: 'clamp(14px,3vw,20px)', display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Cover */}
              <div style={{ width: 56, height: 72, background: 'rgba(255,255,255,0.06)', borderRadius: 4, flexShrink: 0, overflow: 'hidden' }}>
                {b.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.cover_url} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} style={{ color: 'rgba(255,255,255,0.2)' }} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: 0 }}>{b.title}</h3>
                  {b.is_featured && (
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, background: 'rgba(232,76,14,0.2)', color: 'var(--orange)', padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase' }}>Featured</span>
                  )}
                  {!b.is_published && (
                    <span className="badge-draft">Draft</span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 6px' }}>{b.author}</p>
                {b.description && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>{b.description.slice(0, 120)}{b.description.length > 120 ? '…' : ''}</p>}
                <a href={b.download_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'rgba(232,76,14,0.6)', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ExternalLink size={11} /> {b.download_url.slice(0, 50)}{b.download_url.length > 50 ? '…' : ''}
                </a>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                <button onClick={() => toggleFeatured(b)} title={b.is_featured ? 'Unfeature' : 'Set as featured'}
                  style={{ background: b.is_featured ? 'rgba(232,76,14,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${b.is_featured ? 'rgba(232,76,14,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, color: b.is_featured ? 'var(--orange)' : 'rgba(255,255,255,0.4)', padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                  <Star size={13} fill={b.is_featured ? 'var(--orange)' : 'none'} /> {b.is_featured ? 'Featured' : 'Feature'}
                </button>
                <button onClick={() => togglePublished(b)} title={b.is_published ? 'Unpublish' : 'Publish'}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                  {b.is_published ? <EyeOff size={13} /> : <Eye size={13} />}
                  {b.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => openEdit(b)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => remove(b.id)} disabled={deleting === b.id} className="btn-danger">
                  <Trash2 size={13} /> {deleting === b.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
