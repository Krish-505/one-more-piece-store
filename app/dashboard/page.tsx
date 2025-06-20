// in app/(admin)/dashboard/page.tsx
export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-vibrant-magenta">Welcome to the Admin Dashboard!</h1>
      <p className="mt-4">This page is protected. You can only see it if you are logged in.</p>
    </div>
  );
}