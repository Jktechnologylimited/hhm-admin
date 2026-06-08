import AdminLayout from '@/components/admin/AdminLayout';
import DevotionForm from '@/components/admin/DevotionForm';

export default function NewDevotion() {
  return (
    <AdminLayout title="✍️ Create New Devotion">
      <DevotionForm />
    </AdminLayout>
  );
}
