// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white font-sans">
      <main className="flex flex-col items-center justify-center space-y-8">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={120}
          className="dark:invert"
        />
        <h1 className="text-3xl font-bold">Welcome to MedVault</h1>
        <div className="flex space-x-4">
          <Link href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
          <Link href="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
