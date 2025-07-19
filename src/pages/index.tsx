// src/pages/index.tsx

import Head from 'next/head';
import { useRef, RefObject, useState } from 'react';

// Define the categories for navigation based on the project plan
const categories = [
  { id: 'day-to-day-operations', name: 'Day-to-Day Operations' },
  { id: 'finance-and-business', name: 'Finance and Business' },
  { id: 'licensure', name: 'Licensure' },
  { id: 'starting-practice', name: 'Starting Practice' },
  { id: 'miscellaneous', name: 'Miscellaneous' },
];

// Reusable Tool Card component for consistent styling
const ToolCard = ({ title, description, link }: { title: string; description: string; link?: string; }) => (
  <div className="bg-slate-700 p-6 rounded-lg shadow-sm mb-4">
    <h3 className="text-xl font-semibold text-sky-200 mb-3">{title}</h3>
    <p className="text-sky-100 mb-3">{description}</p>
    {link && (
      <a href={link} className="text-blue-400 hover:underline font-semibold">
        Open Tool
      </a>
    )}
  </div>
);

// New Collapsible Section Component for "Coming Soon" items
const CollapsibleSection = ({ title, items }: { title: string; items: { title: string; description: string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-700 rounded-lg shadow-sm mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left"
      >
        <h3 className="text-xl font-semibold text-sky-200">{title}</h3>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          {items.map(item => (
            <div key={item.title} className="border-t border-slate-600 pt-4 mt-4 first:mt-0 first:border-t-0">
               <h4 className="font-semibold text-sky-300">{item.title}</h4>
               <p className="text-sky-100 text-sm mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default function Home() {
  const dayToDayRef = useRef<HTMLDivElement>(null);
  const financeBusinessRef = useRef<HTMLDivElement>(null);
  const licensureRef = useRef<HTMLDivElement>(null);
  const startingPracticeRef = useRef<HTMLDivElement>(null);
  const miscellaneousRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dayToDayTools = {
    available: [
      { title: "Letter Generator", description: "Provides fillable templates for various professional letters such as Emotional Support Animal, Academic Accommodation, and Referral Letters.", link: "/lettergenerator/index.html" },
      { title: "Note Generator", description: "Offers fillable templates for various individual session note formats including general progress note, DAP, SOAP, and BIRP.", link: "/notegenerator/index.html" }
    ],
    comingSoon: [
      { title: "Self-Care Dashboard", description: "Interactive tools for tracking self-care aspects like wellness check-ins and social connections." },
      { title: "Intake Note + Packet Generator", description: "A dynamic tool to generate a full intake packet including Informed Consent, HIPAA notices, and practice policies." },
    ]
  };

  const financeBusinessTools = {
    available: [
        { title: "Insurance Superbill Generator", description: "A fillable template for generating superbills for out-of-network clients.", link: "/superbillgenerator/index.html" }
    ],
    comingSoon: [
        { title: "Business Tracking Tool & Financial Dashboard", description: "Tools and guidance for projecting revenue, managing estimated quarterly taxes, and tracking income and expenses." },
    ]
  };

   const licensureTools = {
    comingSoon: [
        { title: "CE Tracker", description: "A client-side log to manage Continuing Education credits. Track total hours and breakdowns by requirement." },
        { title: "Supervision Log (Both Associate & Supervisor)", description: "A dynamic interface to manage supervision logs for both supervisors and associates." }
    ]
  };
  
  const startingPracticeTools = {
    comingSoon: [
        { title: "Private Practice Starting Aid", description: "A checklist covering steps from determining your business name and obtaining an NPI to setting up an EHR." },
        { title: "Resources for Business Formation", description: "Information and links to external resources such as the Washington Business Hub, SBA, and SCORE." }
    ]
  };

  const miscellaneousTools = {
    comingSoon: [
        { title: "Therapist Dashboard", description: "A personalized landing page providing an overview and quick access to all integrated tools." },
        { title: "Submit Suggestion Option", description: "A button or link that directs users to an external form or opens their email client to submit suggestions." }
    ]
  };


  return (
    <>
      <Head>
        <title>Therapist Toolkit</title>
        <meta name="description" content="A static, local-data, HIPAA-compliant toolkit for mental health professionals." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-indigo-950 text-sky-100">
        <nav className="bg-slate-800 p-4 text-sky-100 sticky top-0 z-50 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-sky-300">Therapist Toolkit</h1>
            <ul className="hidden md:flex space-x-4">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => {
                      switch (category.id) {
                        case 'day-to-day-operations': scrollToSection(dayToDayRef); break;
                        case 'finance-and-business': scrollToSection(financeBusinessRef); break;
                        case 'licensure': scrollToSection(licensureRef); break;
                        case 'starting-practice': scrollToSection(startingPracticeRef); break;
                        case 'miscellaneous': scrollToSection(miscellaneousRef); break;
                      }
                    }}
                    className="hover:text-sky-200 transition-colors duration-200"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <main className="flex-grow container mx-auto p-8 bg-slate-800 rounded-lg shadow-xl my-8">
          <section id="welcome" className="flex items-center justify-center bg-slate-700 rounded-lg px-8 py-24 mb-12">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-sky-300 mb-4">Welcome to Your Therapist Toolkit!</h2>
              <p className="text-xl text-sky-100 max-w-3xl mx-auto">
                A static web-based toolkit designed by a private practice clinician, for private practice clinicians.
              </p>
            </div>
          </section>

          <section id="day-to-day-operations" ref={dayToDayRef} className="py-16 border-b border-slate-700 mb-12">
            <h2 className="text-3xl font-bold text-sky-300 mb-6">Day-to-Day Operations</h2>
            {dayToDayTools.available.map(tool => <ToolCard key={tool.title} {...tool} />)}
            <CollapsibleSection title="Future Tools" items={dayToDayTools.comingSoon} />
          </section>

          <section id="finance-and-business" ref={financeBusinessRef} className="py-16 border-b border-slate-700 mb-12">
            <h2 className="text-3xl font-bold text-sky-300 mb-6">Finance and Business</h2>
            {financeBusinessTools.available.map(tool => <ToolCard key={tool.title} {...tool} />)}
            <CollapsibleSection title="Future Tools" items={financeBusinessTools.comingSoon} />
          </section>

           <section id="licensure" ref={licensureRef} className="py-16 border-b border-slate-700 mb-12">
            <h2 className="text-3xl font-bold text-sky-300 mb-6">Licensure</h2>
            <CollapsibleSection title="Future Tools" items={licensureTools.comingSoon} />
          </section>

          <section id="starting-practice" ref={startingPracticeRef} className="py-16 border-b border-slate-700 mb-12">
            <h2 className="text-3xl font-bold text-sky-300 mb-6">Starting Practice</h2>
            <CollapsibleSection title="Future Tools" items={startingPracticeTools.comingSoon} />
          </section>

          <section id="miscellaneous" ref={miscellaneousRef} className="py-16 mb-12">
            <h2 className="text-3xl font-bold text-sky-300 mb-6">Miscellaneous</h2>
            <CollapsibleSection title="Future Tools" items={miscellaneousTools.comingSoon} />
          </section>

        </main>
      </div>
    </>
  );
}