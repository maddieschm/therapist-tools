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
            <a href="/notegenerator/index.html" className="text-blue-400 hover:underline">
              Counseling Session Notes Generator
            </a>{" "}
            - Streamline your psychotherapy session note-taking process.
          </li>
          <li>
            <a href="/lettergenerator/index.html" className="text-blue-400 hover:underline">
              Client Therapy Letter Generator
            </a>{" "}
            - Quickly generate standardized client letters.
          </li>
          {/* --- ADD THIS NEW LIST ITEM --- */}
          <li>
            <a href="/superbillgenerator/index.html" className="text-blue-400 hover:underline">
              Insurance Superbill Generator
            </a>{" "}
            - Create and manage superbills for insurance reimbursement.
          </li>
        </ul>

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}