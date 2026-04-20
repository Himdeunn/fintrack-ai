import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen p-8 md:p-20">
      <nav className="flex justify-between items-center mb-20">
        <div className="text-2xl font-black uppercase tracking-tighter border-4 border-black px-4 py-1 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          FINTRACK<span className="text-yellow-400">.AI</span>
        </div>
        <div className="flex gap-6">
          <Link href="/login" className="font-black uppercase hover:underline decoration-4">Login</Link>
          <Link href="/register" className="neo-btn bg-cyan-300">Join Now</Link>
        </div>
      </nav>

      <main className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8">
          <h1 className="bento-title mb-10">
            Control your <br />
            <span className="bg-yellow-300 px-4">Finance</span> <br />
            with AI power.
          </h1>
          <p className="text-2xl font-bold max-w-xl mb-12 leading-tight">
            Stop guessing. Start knowing. The smartest way to track your money using Gemini AI analysis.
          </p>
          <Link href="/register" className="neo-btn bg-yellow-300 text-3xl py-6 px-12 inline-block">
            Get Started — Free
          </Link>
        </div>

        <div className="md:col-span-4 grid gap-10">
          <div className="bento-card bg-magenta-400 rotate-2 bg-pink-400">
            <div className="bento-label">01. Smart</div>
            <h3 className="text-3xl font-black uppercase">AI Analysis</h3>
            <p className="font-bold mt-2">Personalized insights for your wallet.</p>
          </div>
          <div className="bento-card bg-cyan-300 -rotate-2">
            <div className="bento-label">02. Safe</div>
            <h3 className="text-3xl font-black uppercase">Security</h3>
            <p className="font-bold mt-2">Bank-level encryption with Supabase.</p>
          </div>
        </div>

        <div className="md:col-span-12 mt-20 border-t-8 border-black pt-10 flex flex-wrap justify-between items-center gap-10">
          <div className="text-6xl font-black opacity-10 uppercase select-none">Next.js 16</div>
          <div className="text-6xl font-black opacity-10 uppercase select-none">Supabase</div>
          <div className="text-6xl font-black opacity-10 uppercase select-none">Gemini AI</div>
          <div className="text-6xl font-black opacity-10 uppercase select-none">Bento UI</div>
        </div>
      </main>
    </div>
  )
}
