'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import SermonForm from '@/components/admin/SermonForm';
export default function EditSermon() {
  const params = useParams();
  const [sermon, setSermon] = useState<any>(null);
  useEffect(() => {
    fetch(`/api/sermons/${params.id}`).then(r=>r.json()).then(d=>setSermon(d.sermon));
  }, [params.id]);
  return (
    <AdminLayout title="Edit Sermon">
      {sermon ? <SermonForm initial={sermon} id={Number(params.id)} /> : <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:18 }}>Loading…</p>}
    </AdminLayout>
  );
}
