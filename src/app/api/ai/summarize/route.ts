import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const apiKey = process.env.GEMINI_API_KEY;
    
    // DEBUG: Ambil daftar model asli dari Google
    console.log("=== FETCHING ACTUAL MODELS FROM GOOGLE ===");
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const listData = await listRes.json();
    
    if (listData.models) {
      console.log("Daftar Model Tersedia:");
      listData.models.forEach((m: any) => {
        console.log(`- ${m.name} (Supported: ${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.error("Gagal mengambil daftar model:", listData);
    }
    console.log("==========================================");

    return NextResponse.json({ error: "Silakan cek daftar model di terminal Anda." }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}