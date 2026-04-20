'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    setIsMounted(true)
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.23, 1, 0.32, 1] } }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-hidden font-sans">
      {/* Background Kinetic Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed top-0 left-0 w-full flex justify-between items-center p-10 z-50 mix-blend-difference"
      >
        <div className="ev-label !mb-0 tracking-[0.8em]">FINTRACK_SYSTEMS_v2.0</div>
        <div className="flex gap-10">
           <span className="ev-label !mb-0 text-white/20">COORD: 52.5°N 13.4°E</span>
           <span className="ev-label !mb-0">LOCAL_TIME: {isMounted ? time : '--:--:--'}</span>
        </div>
      </motion.header>

      <motion.main 
        variants={container}
        initial="hidden"
        animate="show"
        className="ev-container pt-40"
      >
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex flex-col justify-center">
          <motion.div variants={item} className="mb-10">
            <span className="ev-label !text-lime-400">INITIATING_CORE_PROTOCOL</span>
          </motion.div>
          
          <motion.h1 variants={item} className="text-[clamp(4rem,22vw,18rem)] font-black uppercase tracking-[-0.08em] leading-[0.75] mix-blend-difference italic">
            FUTURE<br/>
            <span className="text-white/5 outline-text">FINANCE.</span>
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-24">
            <motion.div variants={item} className="md:col-span-4 space-y-10">
              <p className="text-[13px] font-mono text-white/30 uppercase leading-relaxed tracking-widest max-w-sm">
                [ 001 ] A digital workspace crafted for the elite. Analyze your financial streams with the precision of neural processing.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-px bg-white/20" />
                <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
              </div>
            </motion.div>
            
            <motion.div variants={item} className="md:col-start-9 md:col-span-4 flex flex-col items-end justify-center">
              <Link href="/register" className="ev-btn w-full text-center !py-10 text-[11px] bg-white text-black hover:bg-lime-400 border-none transition-all duration-1000">
                INITIALIZE_SYSTEM_ACCESS
              </Link>
              <div className="mt-8 ev-label opacity-20">ENCRYPTED_ENTRY_POINT</div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-80 border-t border-white/5">
          <motion.div variants={item} className="flex items-center gap-10 mb-32">
            <h2 className="text-6xl font-black italic tracking-tighter">MODULES.</h2>
            <div className="h-px flex-1 bg-white/5" />
          </motion.div>

          <div className="space-y-4">
            {[
              { id: '01', title: 'GEMINI_AI_ANALYSIS', desc: 'Neural summary of your cashflow.' },
              { id: '02', title: 'NEON_CORE_LEDGER', desc: 'High-performance unpooled database.' },
              { id: '03', title: 'ULTRA_INTERFACE', desc: 'Minimalist kinetic aesthetics.' }
            ].map((module) => (
              <motion.div 
                key={module.id} 
                variants={item}
                className="group border-b border-white/5 py-16 flex flex-col md:flex-row justify-between items-start md:items-end hover:bg-white/[0.01] transition-all px-8"
              >
                <div>
                  <span className="ev-label !text-lime-400/40 mb-4">{module.id} / ARCHITECTURE</span>
                  <h3 className="text-4xl md:text-7xl font-black tracking-[-0.05em] uppercase group-hover:text-lime-400 transition-colors duration-700 italic">
                    {module.title}
                  </h3>
                </div>
                <div className="text-right mt-6 md:mt-0">
                  <p className="text-[11px] font-mono text-white/20 uppercase tracking-widest max-w-[200px]">
                    {module.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <motion.section variants={item} className="min-h-screen flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <div className="text-[40vw] font-black italic tracking-tighter">ACCESS</div>
          </div>
          
          <div className="ev-label mb-16 opacity-30">ARE_YOU_READY_TO_EVOLVE?</div>
          <Link href="/login" className="text-6xl md:text-[14vw] font-black tracking-[-0.08em] hover:text-lime-400 transition-all leading-none duration-1000 italic relative z-10">
            LOGIN_SYSTEM
          </Link>
          <div className="mt-20 w-px h-40 bg-white/10" />
        </motion.section>
      </motion.main>

      {/* FOOTER */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="p-20 border-t border-white/5 flex flex-col md:flex-row justify-between gap-10 bg-black relative z-10"
      >
        <div className="ev-label !text-white/20">
          © 2026 FINTRACK_PROTOCOL — DESIGNED_BY_ANTIGRAVITY
        </div>
        <div className="flex gap-12">
          {['GITHUB', 'TWITTER', 'DOCS'].map(link => (
            <a key={link} href="#" className="ev-label !text-white/20 hover:text-lime-400 transition-colors">{link}</a>
          ))}
        </div>
      </motion.footer>

      <style jsx global>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
          color: transparent;
        }
      `}</style>
    </div>
  )
}
