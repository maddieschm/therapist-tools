import Link from "next/link"; // Import Link for internal navigation
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-sky-300 text-center mb-6">Therapist Tools</h1>

        <p className="text-lg text-sky-100 mb-4 text-center sm:text-left">
          Welcome to a collection of tools designed to assist mental health clinicians.
        </p>

        <h2 className="text-2xl font-semibold text-sky-200 mb-4">Available Tools:</h2>
        <ul className="list-disc list-inside text-lg text-sky-100 space-y-2">
          <li>
            <Link href="/notegenerator/index.html" className="text-blue-400 hover:underline">
              Counseling Session Notes Generator
            </Link>{" "}
            - Streamline your psychotherapy session note-taking process.
          </li>
          {/* Add more tools here as you develop them */}
        </ul>

        {/* You can remove or keep the original Next.js boilerplate links/info below if desired */}
        {/* Original content can go here if you want to keep it */}

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
</footer>
    </div>
  );
}