'use client'

import Link from 'next/link'

export default function PrivacyPage() {
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
          <span className="dr-label !mb-0 tracking-[0.6em]">PRIVACY_ENCRYPTION_v1.0</span>
        </div>
        
        <h1 className="dr-title text-[clamp(3rem,10vw,8rem)] leading-none italic mb-24">
          DATA<br/>
          <span className="text-white/10 outline-text">PRIVACY.</span>
        </h1>

        <div className="space-y-24">
          <section>
            <span className="dr-label text-lime-400 block mb-6">[ 01 ] COLLECTION</span>
            <div className="dr-title text-2xl mb-6 uppercase tracking-tight">Stream Acquisition</div>
            <p className="text-white/40 leading-relaxed font-mono text-sm uppercase tracking-wide">
              We collect financial transaction data including amounts, timestamps, and classifications. This data is essential for the neural synthesis engine to provide accurate forecasting.
            </p>
          </section>

          <section>
            <span className="dr-label text-lime-400 block mb-6">[ 02 ] STORAGE</span>
            <div className="dr-title text-2xl mb-6 uppercase tracking-tight">Encrypted Ledger</div>
            <p className="text-white/40 leading-relaxed font-mono text-sm uppercase tracking-wide">
              All data is stored using high-grade encryption protocols (Supabase/PostgreSQL). We do not sell your financial streams to third-party data harvesters.
            </p>
          </section>

          <section>
            <span className="dr-label text-lime-400 block mb-6">[ 03 ] AI_INTERACTION</span>
            <div className="dr-title text-2xl mb-6 uppercase tracking-tight">Neural Intelligence</div>
            <p className="text-white/40 leading-relaxed font-mono text-sm uppercase tracking-wide">
              Your transaction metadata is processed through Gemini AI. This interaction is transient and designed solely for generating the Intelligence Report found in your dashboard.
            </p>
          </section>

          <section>
            <span className="dr-label text-lime-400 block mb-6">[ 04 ] USER_RIGHTS</span>
            <div className="dr-title text-2xl mb-6 uppercase tracking-tight">Node Deletion</div>
            <p className="text-white/40 leading-relaxed font-mono text-sm uppercase tracking-wide">
              Users maintain the right to purge their entire financial stream from the core database at any time. Protocol disconnection results in permanent data erasure.
            </p>
          </section>
        </div>

        <footer className="mt-40 pt-20 border-t border-white/5">
          <div className="dr-label opacity-20">ENCRYPTION_LEVEL: AES_256_GCM</div>
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
