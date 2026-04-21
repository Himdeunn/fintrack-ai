'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-lime-400 selection:text-black font-sans p-10 md:p-20">
      <header className="mb-32">
        <Link href="/" className="dr-label hover:text-lime-400 transition-colors tracking-[0.5em]">
          BACK_TO_CORE_SYSTEM
        </Link>
      </header>

      <main className="max-w-4xl">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-12 h-[1px] bg-lime-400" />
          <span className="dr-label !mb-0 tracking-[0.6em]">LEGAL_PROTOCOL_v1.0</span>
        </div>
        
        <h1 className="dr-title text-[clamp(3rem,10vw,8rem)] leading-none italic mb-24">
          TERMS_OF<br/>
          <span className="text-white/10 outline-text">SERVICE.</span>
        </h1>

        <div className="space-y-24">
          <section>
            <span className="dr-label text-lime-400 block mb-6">[ 01 ] ACCEPTANCE</span>
            <div className="dr-title text-2xl mb-6 uppercase tracking-tight">System Access Protocol</div>
            <p className="text-white/40 leading-relaxed font-mono text-sm uppercase tracking-wide">
              By initializing access to the FinTrack.AI systems, you agree to abide by the core operational protocols. These terms constitute a binding agreement between the user and the system architecture.
            </p>
          </section>

          <section>
            <span className="dr-label text-lime-400 block mb-6">[ 02 ] DATA_PROCESSING</span>
            <div className="dr-title text-2xl mb-6 uppercase tracking-tight">Neural Analysis Disclosure</div>
            <p className="text-white/40 leading-relaxed font-mono text-sm uppercase tracking-wide">
              Your financial streams are processed through advanced neural networks (Gemini AI). By using the system, you grant permission for non-sensitive data points to be analyzed for generating intelligence reports.
            </p>
          </section>

          <section>
            <span className="dr-label text-lime-400 block mb-6">[ 03 ] RESPONSIBILITIES</span>
            <div className="dr-title text-2xl mb-6 uppercase tracking-tight">Operator Integrity</div>
            <p className="text-white/40 leading-relaxed font-mono text-sm uppercase tracking-wide">
              Operators are responsible for maintaining the security of their access IDs. Any unauthorized stream injection or system breach resulting from compromised passphrases is the sole responsibility of the operator.
            </p>
          </section>

          <section>
            <span className="dr-label text-lime-400 block mb-6">[ 04 ] TERMINATION</span>
            <div className="dr-title text-2xl mb-6 uppercase tracking-tight">Protocol Disconnection</div>
            <p className="text-white/40 leading-relaxed font-mono text-sm uppercase tracking-wide">
              The system reserves the right to terminate access to any node found to be violating core security protocols or engaging in malicious data manipulation.
            </p>
          </section>
        </div>

        <footer className="mt-40 pt-20 border-t border-white/5">
          <div className="dr-label opacity-20">SYSTEM_LOG_TIMESTAMP: 2026.04.21</div>
        </footer>
      </main>

      <style jsx global>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
          color: transparent;
        }
      `}</style>
    </div>
  )
}
