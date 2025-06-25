// in app/(auth)/login/page.tsx
import { login } from '@/app/actions';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="container mx-auto max-w-sm p-4 mt-16">
      <form action={login} className="space-y-4 bg-white/30 p-8 ...">
        <h1 className="text-2xl font-heading text-center mb-6">Login</h1>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="w-full p-2 ..."/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="w-full p-2 ..."/>
        </div>
        <button type="submit" className="w-full bg-vibrant-magenta text-white ...">Log In</button>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-gray-200 text-center">{searchParams.message}</p>
        )}
      </form>
    </div>
  );
}