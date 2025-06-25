// in app/(auth)/signup/page.tsx
import { signup } from '@/app/actions'; // Import the server action

export default function SignupPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="container mx-auto max-w-sm p-4 mt-16">
      <form action={signup} className="space-y-4 bg-white/30 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-heading text-center mb-6">Create Account</h1>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" name="fullName" type="text" required className="w-full p-2 ..."/>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="w-full p-2 ..."/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="w-full p-2 ..."/>
        </div>
        <button type="submit" className="w-full bg-vibrant-magenta text-white ...">Sign Up</button>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-gray-200 text-center">{searchParams.message}</p>
        )}
      </form>
    </div>
  );
}