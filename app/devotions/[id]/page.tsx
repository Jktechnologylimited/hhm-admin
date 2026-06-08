'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DevotionForm from '@/components/admin/DevotionForm';

export default function EditDevotion() {
  const params = useParams();
  const [devotion, setDevotion] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/devotions/${params.id}`)
      .then(r => r.json())
      .then(d => setDevotion(d.devotion));
  }, [params.id]);

  return (
    <AdminLayout title="Edit Devotion">
      {devotion ? (
        <DevotionForm initial={devotion} id={Number(params.id)} />
      ) : (
        <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:18 }}>Loading…</p>
      )}
    </AdminLayout>
  );
}
